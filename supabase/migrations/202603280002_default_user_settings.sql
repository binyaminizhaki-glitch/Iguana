-- Update default privacy/location settings for new users.

alter table public.user_settings
  alter column precise_location_enabled set default true,
  alter column default_visibility set default 'all';
