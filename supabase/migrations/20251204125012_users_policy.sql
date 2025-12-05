create policy "Users can only manage their profile." on "public"."users" as permissive for all to authenticated using (
    (
        auth_id = (
            SELECT auth.uid () AS uid
        )
    )
);