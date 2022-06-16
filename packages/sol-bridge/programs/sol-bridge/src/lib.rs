extern crate blake3;

#[macro_use]
extern crate crypt;
use_crypt!("MY-SECRET-SPELL");

mod settings;

use std::convert::TryFrom;

use anchor_lang::{prelude::*, solana_program::system_program};
use anchor_spl::token::{self, TokenAccount};

#[program]
pub mod sol_bridge {
    use super::*;

    #[state]
    pub struct Bridge {
        pub owner: Pubkey,
        pub mint: Pubkey,
        pub nonce: u8,
        pub initialized: bool,
    }

    impl Bridge {
        pub fn new(ctx: Context<Auth>, mint: Pubkey, nonce: u8) -> Result<Self> {
            // lưu mint account (dung de transfer token)
            // luu key_pair ( dung de verify signature)
            // secret key (dung de re-build signature)
            // khoi tao map tx_id -> created_time

            Ok(Self {
                owner: *ctx.accounts.owner.key,
                mint,
                nonce,
                initialized: true,
            })
        }
    }

    #[access_control(ClaimRequest::check_member_account(&ctx, member_nonce, &tx_id, &signature))]
    pub fn claim(
        ctx: Context<ClaimRequest>,
        member_nonce: u8,
        bep_token: String,
        amount: u64,
        tx_id: String,
        signature: String,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        // claim account phải là signer
        // verify tx_id chua co trong map
        // verify signature
        // put tx_id & created time vao map
        // transfer token bằng mint account

        if !state.initialized {
            return Err(ErrorCode::Uninitialized.into());
        }

        let salt = <[u8; 32]>::try_from(settings::get_salt().as_bytes()).unwrap();
        let mut hasher = blake3::Hasher::new_keyed(&salt);

        hasher.update(ctx.program_id.to_string().as_ref());
        hasher.update(bep_token.to_string().as_ref());
        hasher.update(ctx.accounts.owner_token_account.mint.to_string().as_ref());
        hasher.update(
            ctx.accounts
                .user_token_account
                .to_account_info()
                .key
                .to_string()
                .as_ref(),
        );
        hasher.update(amount.to_string().as_ref());
        hasher.update(tx_id.as_ref());
        hasher.update(settings::get_secret().as_bytes());

        let hash = hasher.finalize().to_hex();

        if signature.ne(&hash[..]) {
            return Err(ErrorCode::InvalidSignature.into());
        }

        msg!(
            "Transfer tokens from owner's token account {:?} to user's token account {:?}",
            ctx.accounts.owner_token_account.to_account_info().key,
            ctx.accounts.user_token_account.to_account_info().key
        );

        let seed_key = lc!("MqFAWemmfzjbZd6kaiHkarHs3g3tDg1C");
        let seeds = &[
            state.to_account_info().key.as_ref(),
            seed_key.as_ref(),
            &[state.nonce],
        ];
        let transfer_signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.clone(),
            token::Transfer {
                from: ctx.accounts.owner_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
            transfer_signer_seeds,
        );

        if token::transfer(cpi_ctx, amount).is_err() {
            return Err(ErrorCode::TransferTokenFail.into());
        };

        let member = &mut ctx.accounts.member;

        // member.data = format!("{}/{}/{}/{}", signature,ctx.accounts.user_token_account.to_account_info().key, &tx_id, &ctx.accounts.clock.unix_timestamp);
        member.sent = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Auth<'info> {
    #[account(signer)]
    owner: AccountInfo<'info>,
}

#[derive(Accounts)]
#[instruction(member_nonce: u8, bep_token: String, amount: u64, tx_id: String, signature: String)]
pub struct ClaimRequest<'info> {
    #[account(mut)]
    state: ProgramState<'info, Bridge>,
    #[account(seeds = [state.to_account_info().key.as_ref(), lc!("MqFAWemmfzjbZd6kaiHkarHs3g3tDg1C").as_ref(), & [state.nonce]])]
    authority: AccountInfo<'info>,
    #[account(
        mut,
        constraint = owner_token_account.owner == state.owner,
        constraint = "6JMenadSsShX5gdyfK4RKzBFTGgLvj3QLNTnkwES7H1j;2WHNoAUxrd4T7y6oV64XHo38oo5tsdggiU71kbidKj7J".contains(&owner_token_account.mint.to_string())
    )]
    owner_token_account: CpiAccount<'info, TokenAccount>,
    #[account(signer)]
    user: AccountInfo<'info>,
    #[account(
        mut,
        constraint = &user_token_account.owner == user.key,
        constraint = "6JMenadSsShX5gdyfK4RKzBFTGgLvj3QLNTnkwES7H1j;2WHNoAUxrd4T7y6oV64XHo38oo5tsdggiU71kbidKj7J".contains(&user_token_account.mint.to_string())
    )]
    user_token_account: CpiAccount<'info, TokenAccount>,
    #[account(
        init,
        seeds = [&tx_id.as_bytes()[2..34], &tx_id.as_bytes()[34..66], &[member_nonce]],
        payer = user,
        space = 9,
    )]
    member: ProgramAccount<'info, Member>,
    #[account("token_program.key == &token::ID")]
    token_program: AccountInfo<'info>,
    clock: Sysvar<'info, Clock>,
    rent: Sysvar<'info, Rent>,
    #[account(constraint = system_program.key == &system_program::ID)]
    system_program: AccountInfo<'info>,
}

impl<'info> ClaimRequest<'info> {
    fn check_member_account(
        ctx: &Context<ClaimRequest>,
        member_nonce: u8,
        tx_id: &String,
        signature: &String,
    ) -> Result<()> {
        if signature.chars().count() != 64 || tx_id.chars().count() < 66 {
            return Err(ErrorCode::InvalidSignature.into());
        }

        let seeds = &[
            &tx_id.as_bytes()[2..34],
            &tx_id.as_bytes()[34..66],
            &[member_nonce],
        ];
        let member_signer = Pubkey::create_program_address(seeds, ctx.program_id)
            .map_err(|_| ErrorCode::InvalidNonce)?;

        if &member_signer != ctx.accounts.member.to_account_info().key {
            return Err(ErrorCode::InvalidMemberSigner.into());
        }

        Ok(())
    }
}

#[account]
pub struct Member {
    // pub data: String,
    pub sent: bool,
}

#[error]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Invalid signature")]
    InvalidSignature,
    #[msg("Mint authority mismatch")]
    MintAuthorityMismatch,
    #[msg("Mint mismatch")]
    MintMismatch,
    #[msg("Uninitialized")]
    Uninitialized,
    #[msg("Token mismatch")]
    TokenMismatch,
    #[msg("Transfer token fail")]
    TransferTokenFail,
    #[msg("The nonce given doesn't derive a valid program address.")]
    InvalidNonce,
    #[msg("Member signer doesn't match the derived address.")]
    InvalidMemberSigner,
}
