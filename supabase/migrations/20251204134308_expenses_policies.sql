create policy "Users can only manage expenses categories related to their home" on "public"."expense_categories" as permissive for all to authenticated using (
    (
        home_id = (
            SELECT public.get_request_home () AS get_request_home
        )
    )
);

create policy "Users can only manage expenses grouped related to their home" on "public"."expense_grouped" as permissive for all to authenticated using (
    (
        home_id = (
            SELECT public.get_request_home () AS get_request_home
        )
    )
);

create policy "Users can only manage expenses groups related to their home" on "public"."expense_groups" as permissive for all to authenticated using (
    (
        home_id = (
            SELECT public.get_request_home () AS get_request_home
        )
    )
);

create policy "Users can only manage expenses related to their home" on "public"."expense_groups_categories" as permissive for all to authenticated using (
    (
        home_id = (
            SELECT public.get_request_home () AS get_request_home
        )
    )
);

create policy "Users can only manage expenses items related to their home" on "public"."expense_items" as permissive for all to authenticated using (
    (
        home_id = (
            SELECT public.get_request_home () AS get_request_home
        )
    )
);

create policy "Users can only manage expenses related to their home." on "public"."expenses" as permissive for all to authenticated using (
    (
        home_id = (
            SELECT public.get_request_home () AS get_request_home
        )
    )
);