Edge function send-push is deployed from the Supabase project (verify_jwt off, checks x-push-secret against push_config).
It sends the web push with npm:web-push and deletes subscriptions that return 404 or 410.
