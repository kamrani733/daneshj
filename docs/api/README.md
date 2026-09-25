# API index — Daneshjoam microservices

Generated from the OpenAPI files in this folder (the `.openapi.yaml` files are the source of truth). Find the endpoint here, then read only that operation in the YAML.

Security schemes (all services): `UserBearerAuth`, `AdminBearerAuth`, `UniversityBearerAuth`, `IndustryBearerAuth`, `BusinessBearerAuth` — five actor types: User, Admin, University, Industry, Business. "—" = no security declared in the spec.

Known spec issues: see docs/09-known-issues.md (Interactive Ops declares no security; some Notification endpoints the user UI needs are Admin-only).

## Auth MS (v6.0.0) — `auth-ms.openapi.yaml`

| Method | Path | Summary | Security |
|---|---|---|---|
| POST | `/actor_accesses/create_access_override_actor` | Create Accesses Override Actor | Admin |
| POST | `/actor_accesses/create_access_override_ip_range` | Create Accesses Override IP Range | Admin |
| POST | `/actor_accesses/create_access_rule` | Create AccessRule | Admin |
| POST | `/actor_accesses/create_sub_operation` | Create SubOperation | Admin |
| DELETE | `/actor_accesses/delete_access_rule` | Delete AccessRule | Admin |
| DELETE | `/actor_accesses/delete_sub_operation` | Delete SubOperation | Admin |
| GET | `/actor_accesses/display_access_override_actor_to_actor` | Display Accesses Override Actor history to actor | Admin,Business,Industry,University,User |
| GET | `/actor_accesses/display_access_override_actor_to_admin` | Display Accesses Override Actor history to admin | Admin |
| GET | `/actor_accesses/display_access_override_ip_range_to_admin` | Display Accesses Override IP Range history to admin | Admin |
| GET | `/actor_accesses/display_access_rule` | Display AccessRule | Admin |
| GET | `/actor_accesses/display_sub_operation` | Display SubOperation | Admin |
| GET | `/actor_accesses/get_access_actor` | Get Access Default and Restriction By Actor Type, use by front-end | Admin,Business,Industry,University,User |
| GET | `/actor_accesses/get_access_guest` | Get Access Guest, use by front-end | — |
| GET | `/actor_accesses/get_target_type` | Get Target Type details, use by front-end | — |
| PUT | `/actor_accesses/manually_terminated_access_override_actor` | Manually Terminated Accesses Override Actor | Admin |
| PUT | `/actor_accesses/manually_terminated_access_override_ip_range` | Manually Terminated Accesses Override IP Range | Admin |
| GET | `/actor_accesses/operation` | Display Operation | Admin |
| POST | `/actor_accesses/operation` | Create Operation | Admin |
| PATCH | `/actor_accesses/operation` | Update Operation | Admin |
| DELETE | `/actor_accesses/operation` | Delete Operation | Admin |
| GET | `/actor_accesses/reason` | Display Restriction/UnRestriction Reason | Admin |
| POST | `/actor_accesses/reason` | Create Restriction/UnRestriction Reason | Admin |
| PATCH | `/actor_accesses/reason` | Update Restriction/UnRestriction Reason | Admin |
| DELETE | `/actor_accesses/reason` | Delete Restriction/UnRestriction Reason | Admin |
| POST | `/actor_accesses/set_db_accesses` | actor_accesses_set_db_accesses_create | Admin |
| PATCH | `/actor_accesses/update_access_rule` | Update AccessRule | Admin |
| PATCH | `/actor_accesses/update_sub_operation` | Update SubOperation | Admin |
| PUT | `/auth/account_change_status` | Account Change Status by admin | Admin |
| PATCH | `/auth/actor_change_identity_fields` | Change Username/Email/Mobile by Actor | Admin,Business,Industry,University,User |
| POST | `/auth/actor_change_password` | Change Password by Actor | Admin,Business,Industry,University,User |
| PATCH | `/auth/actor_disable_totp` | Disable TOTP MFA for use TOTP in verify_code for login | Admin,Business,Industry,University,User |
| PATCH | `/auth/actor_enable_totp` | Enable TOTP MFA for use TOTP in verify_code for login | Admin,Business,Industry,University,User |
| POST | `/auth/actor_login_by_identity_and_password` | Login by identity and password | — |
| POST | `/auth/actor_logout` | Actor Logout From a Session | Admin,Business,Industry,University,User |
| POST | `/auth/actor_reset_password` | Reset Password by Actor | Admin,Business,Industry,University,User |
| POST | `/auth/actor_send_code` | Send Code for step_1 register/login/reset_pass | — |
| POST | `/auth/actor_send_otp_for_login` | Send OTP for step_1 login | — |
| PATCH | `/auth/actor_toggle_two_step_login` | Enable/Disable Two_Step_Login option for login (for use verify_password api) | Admin,Business,Industry,University,User |
| POST | `/auth/actor_track_interaction` | Recording the last actor interaction by the front-end for use in automatic logout | Admin,Business,Industry,University,User |
| POST | `/auth/actor_verify_code` | Verify Code for step_2 register/login/reset_pass | — |
| POST | `/auth/actor_verify_password` | Verify password for step_3 login(is_two_step_login) | Admin,Business,Industry,University,User |
| POST | `/auth/block_actor` | Blocking actors by admin | Admin |
| GET | `/auth/block_actor_history_to_actor` | Display block actor history to account owner | Admin,Business,Industry,University,User |
| GET | `/auth/block_actor_history_to_admin` | Display block actor history to admin | Admin |
| GET | `/auth/block_info` | display block_info for one actor by admin | Admin |
| GET | `/auth/block_reason` | Display Block Reason | Admin |
| POST | `/auth/block_reason` | Create Block Reason | Admin |
| PUT | `/auth/block_reason` | Update Block Reason | Admin |
| DELETE | `/auth/block_reason` | Delete Block Reason | Admin |
| GET | `/auth/callback/` | auth_callback_retrieve | Admin |
| POST | `/auth/display_active_sessions` | Get Active Sessions and Display to Actor | Admin,Business,Industry,University,User |
| GET | `/auth/display_active_sessions_for_limit_reached` | Get Active Sessions and Display to Actor for Limit Reached | Admin,Business,Industry,University,User |
| GET | `/auth/display_ban_actor` | Display Ban UnRegistered/Registered Actor List by actor_type to admin with search & filter | Admin |
| GET | `/auth/display_current_security_setting` | Display current security settings | Admin,Business,Industry,University,User |
| GET | `/auth/display_unban_actor` | Display UnBan UnRegistered/Registered Actor List by actor_type to admin with search & filt | Admin |
| GET | `/auth/get_token_info` | Get Token info | Admin,Business,Industry,University,User |
| PATCH | `/auth/inactive_session` | Inactive Session Actor | Admin,Business,Industry,University,User |
| PATCH | `/auth/inactive_session_for_limit_reached` | Inactive Session Actor For limit reached | Admin,Business,Industry,University,User |
| PATCH | `/auth/inactive_session_then_get_token` | Inactive Session Actor For limit reached then get token (Login or verify for login) | Admin,Business,Industry,University,User |
| GET | `/auth/public_security_questions_content` | Get a list of question to actors | Admin,Business,Industry,University,User |
| POST | `/auth/refresh_token` | Refresh Token for Stay Login | — |
| POST | `/auth/reserved-username/create` | Create Reserved Username | Admin |
| POST | `/auth/reserved-username/import` | Upload Excel Reserved Usernames by admin | Admin |
| GET | `/auth/reserved-username/list` | Display list Reserved Username | Admin |
| GET | `/auth/reserved-username/retrieve` | Display details Reserved Username | Admin |
| PATCH | `/auth/reserved-username/update` | Update Reserved Username | Admin |
| GET | `/auth/security_questions_answer` | Retrieve Security Question Codes for an actor | Admin,Business,Industry,University,User |
| POST | `/auth/security_questions_answer` | Create Security Question Answer | Admin,Business,Industry,University,User |
| PUT | `/auth/security_questions_answer` | Update Security Question Answer | Admin,Business,Industry,University,User |
| DELETE | `/auth/security_questions_answer` | Delete Security Question Answer | Admin,Business,Industry,University,User |
| GET | `/auth/security_questions_content` | Get a list or details of a specific question to Admin | Admin |
| POST | `/auth/security_questions_content` | Create a new question | Admin |
| PUT | `/auth/security_questions_content` | Edit an existing question | Admin |
| DELETE | `/auth/security_questions_content` | Delete a question | Admin |
| POST | `/auth/unban_actor` | Manually UnBan an actor by an admin | Admin |
| GET | `/auth/unban_actor_history_to_actor` | Display manual unban actor history to account owner | Admin,Business,Industry,University,User |
| PUT | `/auth/unblock_actor` | Unblocking actors by admin | Admin |
| GET | `/connect/` | connect_retrieve | Admin |
| GET | `/connect/.well-known/jwks.json` | connect_.well_known_jwks.json_retrieve | Admin |
| GET | `/connect/.well-known/openid-configuration` | connect_.well_known_openid_configuration_retrieve | Admin |
| GET | `/connect/authorize` | connect_authorize_retrieve | Admin |
| POST | `/connect/authorize` | connect_authorize_create | Admin |
| POST | `/connect/create/client/` | connect_create_client_create | Admin |
| POST | `/connect/introspect` | connect_introspect_create | Admin |
| POST | `/connect/register` | connect_register_create | Admin |
| POST | `/connect/token` | connect_token_create | Admin |
| POST | `/connect/token/revoke` | connect_token_revoke_create | Admin |
| GET | `/connect/userinfo` | connect_userinfo_retrieve | Admin |
| GET | `/core/aut_check_ip_versions/` | core_aut_check_ip_versions_retrieve | — |
| DELETE | `/core/aut_clear_redis` | core_aut_clear_redis_destroy | Admin |
| POST | `/core/aut_execute_command/` | core_aut_execute_command_create | — |
| GET | `/core/aut_test_token` | core_aut_test_token_retrieve | Admin,Business,Industry,University,User |
| DELETE | `/core/clean_migrations` | core_clean_migrations_destroy | Admin |
| GET | `/core/get_log_authentication` | core_get_log_authentication_retrieve | — |
| GET | `/core/run_netstat/` | core_run_netstat_retrieve | — |
| POST | `/core/set_db_my_client` | core_set_db_my_client_create | Admin |
| PUT | `/ipc/aut_test_actor_update_identity_fields` | ipc_aut_test_actor_update_identity_fields_update | — |
| PUT | `/ipc/aut_test_admin_update_identity_fields` | ipc_aut_test_admin_update_identity_fields_update | — |
| PUT | `/ipc/aut_test_change_block_actor_status` | ipc_aut_test_change_block_actor_status_update | — |
| PUT | `/ipc/aut_test_change_block_admin_status` | ipc_aut_test_change_block_admin_status_update | — |
| PUT | `/ipc/aut_test_change_delete_actor_status` | ipc_aut_test_change_delete_actor_status_update | — |
| PUT | `/ipc/aut_test_change_delete_admin_status` | ipc_aut_test_change_delete_admin_status_update | — |
| GET | `/ipc/aut_test_change_individual_status_for_user` | ipc_aut_test_change_individual_status_for_user_retrieve | — |
| GET | `/ipc/aut_test_create_actor_by_type` | ipc_aut_test_create_actor_by_type_retrieve | — |
| GET | `/ipc/aut_test_create_admin` | ipc_aut_test_create_admin_retrieve | — |
| GET | `/ipc/aut_test_get_active_language_abbreviations` | ipc_aut_test_get_active_language_abbreviations_retrieve | — |
| GET | `/ipc/aut_test_get_actor_ids_by_actor_type` | ipc_aut_test_get_actor_ids_by_actor_type_retrieve | — |
| GET | `/ipc/aut_test_get_actors_by_block_info` | ipc_aut_test_get_actors_by_block_info_retrieve | — |
| GET | `/ipc/aut_test_get_admins_role_ids` | ipc_aut_test_get_admins_role_ids_retrieve | — |
| GET | `/ipc/aut_test_get_ip_address_by_type` | ipc_aut_test_get_ip_address_by_type_retrieve | — |
| GET | `/ipc/aut_test_get_register_confirm_status_by_type` | ipc_aut_test_get_register_confirm_status_by_type_retrieve | — |
| GET | `/ipc/aut_test_get_system_setting` | ipc_aut_test_get_system_setting_retrieve | — |
| GET | `/ipc/aut_test_get_username_by_type` | ipc_aut_test_get_username_by_type_retrieve | — |
| GET | `/ipc/aut_test_notify_register_user_by_referral_code` | ipc_aut_test_notify_register_user_by_referral_code_retrieve | — |
| GET | `/ipc/aut_test_search_ip_address_by_type` | ipc_aut_test_search_ip_address_by_type_retrieve | — |
| GET | `/ipc/aut_test_search_username_by_actor_type` | ipc_aut_test_search_username_by_actor_type_retrieve | — |
| GET | `/ipc/aut_test_validate_referral_code` | ipc_aut_test_validate_referral_code_retrieve | — |
| GET | `/report_log/report_delete_account_to_admin` | Display Report Delete Account to admin | Admin |
| GET | `/report_log/report_delete_account_to_owner_actor` | Display Report Delete Account to owner actor | Admin,Business,Industry,University,User |
| GET | `/report_log/report_edit_security_setting_to_admin` | Display Report Edit Security Settings to admin | Admin |
| GET | `/report_log/report_edit_security_setting_to_owner_actor` | Display Report Edit Security Settings to owner actor | Admin,Business,Industry,University,User |
| GET | `/report_log/report_login_logout_to_admin` | Display Report Login Logout to admin | Admin |
| GET | `/report_log/report_login_logout_to_owner_actor` | Display Report Login Logout to owner actor | Admin,Business,Industry,University,User |

## Actor MS (v1.0.0) — `actor-ms.openapi.yaml`

| Method | Path | Summary | Security |
|---|---|---|---|
| GET | `/core/actor_test_token` | core_actor_test_token_retrieve | Admin,Business,Industry,University,User |
| DELETE | `/core/clean_migrations` | core_clean_migrations_destroy | Admin |
| GET | `/core/get_log_actor` | core_get_log_actor_retrieve | — |
| GET | `/core/run_netstat/` | core_run_netstat_retrieve | — |
| PUT | `/ipc/act_test_actor_update_identity_fields` | ipc_act_test_actor_update_identity_fields_update | — |
| PUT | `/ipc/act_test_change_block_actor_status` | ipc_act_test_change_block_actor_status_update | — |
| PUT | `/ipc/act_test_change_delete_actor_status` | ipc_act_test_change_delete_actor_status_update | — |
| GET | `/ipc/act_test_change_individual_status_for_user` | ipc_act_test_change_individual_status_for_user_retrieve | — |
| GET | `/ipc/act_test_create_actor_by_type/` | ipc_act_test_create_actor_by_type_retrieve | — |
| GET | `/ipc/act_test_get_active_language_abbreviations` | ipc_act_test_get_active_language_abbreviations_retrieve | — |
| GET | `/ipc/act_test_get_actor_service_titles/` | ipc_act_test_get_actor_service_titles_retrieve | — |
| GET | `/ipc/act_test_get_actors_by_block_info` | ipc_act_test_get_actors_by_block_info_retrieve | — |
| GET | `/ipc/act_test_get_ip_address_by_type` | ipc_act_test_get_ip_address_by_type_retrieve | — |
| GET | `/ipc/act_test_get_locales/` | ipc_act_test_get_locales_retrieve | — |
| GET | `/ipc/act_test_get_register_confirm_status_by_type/` | ipc_act_test_get_register_confirm_status_by_type_retrieve | — |
| GET | `/ipc/act_test_get_system_setting` | ipc_act_test_get_system_setting_retrieve | — |
| GET | `/ipc/act_test_get_username_by_type` | ipc_act_test_get_username_by_type_retrieve | — |
| GET | `/ipc/act_test_search_ip_address_by_type` | ipc_act_test_search_ip_address_by_type_retrieve | — |
| GET | `/ipc/act_test_search_username_by_actor_type` | ipc_act_test_search_username_by_actor_type_retrieve | — |
| GET | `/ipc/act_test_send_system_ticket` | ipc_act_test_send_system_ticket_retrieve | — |
| GET | `/ipc/act_test_service_title_name/` | ipc_act_test_service_title_name_retrieve | — |
| PUT | `/profiles_base/cooperation/request/approve` | Approval Cooperation Request | Admin |
| PUT | `/profiles_base/cooperation/request/confirm-guest` | Confirm Guest_User(individual) Cooperation Request | Admin |
| GET | `/profiles_base/cooperation/request/default-user-info` | Get Default Info for Send Cooperation Request by logged-in User | User |
| PUT | `/profiles_base/cooperation/request/reject` | Reject Cooperation Request | Admin |
| POST | `/profiles_base/cooperation/request/reject-reason/change-state` | State Action Reject Cooperation Reason | Admin |
| POST | `/profiles_base/cooperation/request/reject-reason/create` | Create Cooperation Request Reject Reason | Admin |
| GET | `/profiles_base/cooperation/request/reject-reason/list` | Display list Reject Cooperation Reason | Admin |
| GET | `/profiles_base/cooperation/request/reject-reason/retrieve` | Display details Reject Cooperation Reason | Admin |
| PATCH | `/profiles_base/cooperation/request/reject-reason/update` | Update Cooperation Request Reject Reason | Admin |
| POST | `/profiles_base/cooperation/request/send` | Send Cooperation Request | — |
| POST | `/profiles_base/cooperation/request/send/authenticated-user` | Send Cooperation Request by logged-in User | User |
| GET | `/profiles_base/get_actor_info` | Get Actor info | Admin,Business,Industry,University,User |
| PUT | `/profiles_base/public/change-status` | Public Panel Change Status (create/delete) by admin | Admin |
| POST | `/profiles_base/public/change-status-request` | Send Request for Public Panel Change Status (create/delete) by owner | Admin,Business,Industry,University,User |
| GET | `/profiles_base/public/get-status-by-admin` | Getting the current status of the public panel by the admin | Admin |
| GET | `/profiles_base/public/get-status-by-owner` | Getting the current status of the public panel by the owner | Admin,Business,Industry,University,User |
| POST | `/profiles_base/set_db_default_fields` | profiles_base_set_db_default_fields_create | Admin |
| GET | `/profiles_business/admin/actor-list` | Display Business List to admin | Admin |
| GET | `/profiles_business/private/retrieve-for-admin` | Retrieve Private Panel details and pending changes for admin | Admin |
| GET | `/profiles_business/private/retrieve-for-owner` | Retrieve Private Panel details and pending changes for owner | Business |
| POST | `/profiles_business/private/review-by-admin` | Review pending Private Panel changes by admin | Admin |
| POST | `/profiles_business/private/review-by-owner` | Review pending Private Panel changes by owner | Business |
| POST | `/profiles_business/private/state/review-by-admin` | Review Private Panel change state record request by admin | Admin |
| POST | `/profiles_business/private/state/review-by-owner` | Review Private Panel change state record request by owner | Business |
| PATCH | `/profiles_business/private/state/submit-by-admin` | Submit Private Panel change state record request by admin | Admin |
| PATCH | `/profiles_business/private/state/submit-by-owner` | Submit Private Panel change state record request by owner | Business |
| PATCH | `/profiles_business/private/tab/submit-by-admin` | Submit Private Panel change request by admin | Admin |
| PATCH | `/profiles_business/private/tab/submit-by-owner` | Submit Private Panel change request by owner | Business |
| GET | `/profiles_business/private/temporary/retrieve-for-admin` | Retrieve Temporary Private Panel details and pending changes for admin | Admin |
| PATCH | `/profiles_business/private/temporary/state/submit-by-admin` | Submit Temporary Private Panel change state record request by admin | Admin |
| PATCH | `/profiles_business/private/temporary/tab/submit-by-admin` | Submit Temporary Private Panel change request by admin | Admin |
| GET | `/profiles_business/public/retrieve-for-admin` | Retrieve Public Panel details and pending changes for admin | Admin |
| GET | `/profiles_business/public/retrieve-for-owner` | Retrieve Public Panel details and pending changes for owner | Business |
| GET | `/profiles_business/public/retrieve-for-visitor` | Display Public Profile to owner/other/admin in public panel for view | Admin,Business,Industry,University,User |
| POST | `/profiles_business/public/review-by-admin` | Review pending Public Panel changes by admin | Admin |
| PATCH | `/profiles_business/public/tab/submit-by-owner` | Submit Public Panel change request by owner | Business |
| GET | `/profiles_individual/admin/actor-list` | Display Individual List to admin | Admin |
| PUT | `/profiles_individual/cooperation/terminate` | Termination of cooperation by admin | Admin |
| PUT | `/profiles_individual/enable-individual-service-provider` | Enable Individual Service Provider by admin (restore CooperationTerminate actor) | Admin |
| GET | `/profiles_individual/private/retrieve-for-admin` | Retrieve Private Panel details and pending changes for admin | Admin |
| GET | `/profiles_individual/private/retrieve-for-owner` | Retrieve Private Panel details and pending changes for owner | User |
| POST | `/profiles_individual/private/review-by-admin` | Review pending Private Panel changes by admin | Admin |
| POST | `/profiles_individual/private/review-by-owner` | Review pending Private Panel changes by owner | User |
| POST | `/profiles_individual/private/state/review-by-admin` | Review Private Panel change state record request by admin | Admin |
| POST | `/profiles_individual/private/state/review-by-owner` | Review Private Panel change state record request by owner | User |
| PATCH | `/profiles_individual/private/state/submit-by-admin` | Submit Private Panel change state record request by admin | Admin |
| PATCH | `/profiles_individual/private/state/submit-by-owner` | Submit Private Panel change state record request by owner | User |
| PATCH | `/profiles_individual/private/tab/submit-by-admin` | Submit Private Panel change request by admin | Admin |
| PATCH | `/profiles_individual/private/tab/submit-by-owner` | Submit Private Panel change request by owner | User |
| GET | `/profiles_individual/private/temporary/retrieve-for-admin` | Retrieve Temporary Private Panel details and pending changes for admin | Admin |
| PATCH | `/profiles_individual/private/temporary/tab/state/submit-by-admin` | Submit Temporary Private Panel change state record request by admin | Admin |
| PATCH | `/profiles_individual/private/temporary/tab/submit-by-admin` | Submit Temporary Private Panel change request by admin | Admin |
| GET | `/profiles_individual/public/retrieve-for-admin` | Retrieve Public Panel details and pending changes for admin | Admin |
| GET | `/profiles_individual/public/retrieve-for-owner` | Retrieve Public Panel details and pending changes for owner | User |
| GET | `/profiles_individual/public/retrieve-for-visitor` | Display Public Profile to owner/other/admin in public panel for view | Admin,Business,Industry,University,User |
| POST | `/profiles_individual/public/review-by-admin` | Review pending Public Panel changes by admin | Admin |
| PATCH | `/profiles_individual/public/tab/submit-by-owner` | Submit Public Panel change request by owner | User |
| GET | `/profiles_user/admin/actor-list` | Display User List to admin | Admin |
| GET | `/profiles_user/private/retrieve-for-admin` | Retrieve Private Panel details and pending changes for admin | Admin |
| GET | `/profiles_user/private/retrieve-for-owner` | Retrieve Private Panel details and pending changes for owner | User |
| POST | `/profiles_user/private/review-by-admin` | Review pending Private Panel changes by admin | Admin |
| POST | `/profiles_user/private/review-by-owner` | Review pending Private Panel changes by owner | User |
| POST | `/profiles_user/private/state/review-by-admin` | Review Private Panel change state record request by admin | Admin |
| POST | `/profiles_user/private/state/review-by-owner` | Review Private Panel change state record request by owner | User |
| PATCH | `/profiles_user/private/state/submit-by-admin` | Submit Private Panel change state record request by admin | Admin |
| PATCH | `/profiles_user/private/state/submit-by-owner` | Submit Private Panel change state record request by owner | User |
| PATCH | `/profiles_user/private/tab/submit-by-admin` | Submit Private Panel change request by admin | Admin |
| PATCH | `/profiles_user/private/tab/submit-by-owner` | Submit Private Panel change request by owner | User |
| GET | `/profiles_user/public/retrieve-for-admin` | Retrieve Public Panel details and pending changes for admin | Admin |
| GET | `/profiles_user/public/retrieve-for-owner` | Retrieve Public Panel details and pending changes for owner | User |
| GET | `/profiles_user/public/retrieve-for-visitor` | Display Public Profile to owner/other/admin in public panel for view | Admin,Business,Industry,University,User |
| POST | `/profiles_user/public/review-by-admin` | Review pending Public Panel changes by admin | Admin |
| PATCH | `/profiles_user/public/tab/submit-by-owner` | Submit Public Panel change request by owner | User |
| GET | `/profiles_user/test_add_username_to_response` | Add Username To Response  | — |
| GET | `/report_log/cooperation/request/list-to-admin` | Display list Cooperation Request to admin | Admin |
| GET | `/report_log/cooperation/request/list-to-owner` | Display list Cooperation Request to owner | Admin,Business,Industry,University,User |
| POST | `/service_titles/service-category/change-state` | State Action Service Category | Admin |
| POST | `/service_titles/service-category/create` | Create Service Category | Admin |
| GET | `/service_titles/service-category/list` | Display list Service Category | Admin |
| GET | `/service_titles/service-category/retrieve` | Display details Service Category | Admin |
| PATCH | `/service_titles/service-category/update` | Update Service Category | Admin |
| POST | `/service_titles/service-title/change-state` | State Action Service Title | Admin |
| POST | `/service_titles/service-title/create` | Create Service Title | Admin |
| GET | `/service_titles/service-title/list-to-admin` | Display list Service Title to admin | Admin |
| GET | `/service_titles/service-title/list-to-all` | Display list Service Title to all | Admin,Business,Industry,University,User |
| GET | `/service_titles/service-title/retrieve` | Display details Service Title | Admin |
| POST | `/service_titles/service-title/seed` | service_titles_service_title_seed_create | Admin |
| PATCH | `/service_titles/service-title/update` | Update Service Title | Admin |

## Notification MS (v1.0.0) — `notification-ms.openapi.yaml`

| Method | Path | Summary | Security |
|---|---|---|---|
| GET | `/core/actor_test_token` | test token | Admin,Business,Industry,University,User |
| POST | `/notification/actor-notifications/click/{recipient_id}` | click on notification link | Admin |
| GET | `/notification/actor-notifications/last5` | Display last 5 notifications of actor | Admin,Business,Industry,University,User |
| GET | `/notification/actor-notifications/list` | Display all  notifications of actor | Admin,Business,Industry,University,User |
| POST | `/notification/actor-notifications/read-all` | mark as read all notifications | Admin,Business,Industry,University,User |
| POST | `/notification/actor-notifications/read-last-5` | mark as read last 5 notifications  | Admin,Business,Industry,University,User |
| POST | `/notification/actor-notifications/read/{sent_notification_id}` | read a notificaiton | Admin,Business,Industry,University,User |
| GET | `/notification/actor-notifications/unread-count` | count unread notifications | Admin |
| POST | `/notification/actor-settings/create` | Apply actor notification settings | Admin,Business,Industry,University,User |
| GET | `/notification/actor-settings/list` | Get actor notification settings | Admin |
| POST | `/notification/category/create` | create category | Admin |
| DELETE | `/notification/category/delete/{id}` | delete category | Admin |
| GET | `/notification/category/list` | list of categories | Admin |
| PUT | `/notification/category/update/{id}` | update category | Admin |
| POST | `/notification/language/create` | create language | Admin |
| DELETE | `/notification/language/delete/{id}` | delete language (soft delete) | Admin |
| GET | `/notification/language/list` | list of languages | Admin |
| PUT | `/notification/language/update/{id}` | update language | Admin |
| GET | `/notification/report/actor_charts_report` | get actor/user notification charts report | Admin,Business,Industry,University,User |
| GET | `/notification/report/actor_statistics_report` | get actor/user notification statistics report | Admin,Business,Industry,University,User |
| GET | `/notification/report/category_history_report` | get category history report | Admin |
| GET | `/notification/report/charts_report` | get charts report (bar charts by time and pie charts) | Admin |
| GET | `/notification/report/detailed_status_report` | get detailed status report | Admin,Business,Industry,University,User |
| GET | `/notification/report/ignorance_reports` | get notification ignorance report | Admin |
| GET | `/notification/report/manual_notification_history_reports` | get manual notification history report | Admin |
| GET | `/notification/report/notification_reports` | get notificatoin reports | Admin |
| GET | `/notification/report/read_reports` | get notification read reports | Admin |
| GET | `/notification/report/statistics_report` | get notification statistics report | Admin |
| GET | `/notification/report/system_notification_audit_log` | get detailed status report | Admin |
| GET | `/notification/report/system_notification_history_reports` | get system notification history report | Admin |
| GET | `/notification/report/top_unread_reports` | get report of unread notifications | Admin |
| POST | `/notification/sent-notification/manual1/send` | create and send manual notification | Admin |
| POST | `/notification/sent-notification/manual2/send` | manual notification 2  | Admin |
| GET | `/notification/sent-notifications/manual/list` | List of manual notifications | Admin |
| POST | `/notification/sent-notifications/system` | sent system notification  | Admin |
| POST | `/notification/system/create` | create system notification | Admin |
| DELETE | `/notification/system/delete/{id}` | delete System notifications  | Admin |
| GET | `/notification/system/list` | System notifications List | Admin |
| PATCH | `/notification/system/update/{id}` | update System notifications  | Admin |

## Interactive Ops MS (v1.0.0) — `interactive-ops-ms.openapi.yaml`

| Method | Path | Summary | Security |
|---|---|---|---|
| GET | `/core/ino_test_token/` | test token | Admin,Business,Industry,University,User |
| POST | `/interactive-ops/follow` | Follow/Unfollow user/industry/university/business/service/product by actor | — |
| GET | `/interactive-ops/follow/followers` | Get followers list of user/industry/university/business/service/product by actor | — |
| GET | `/interactive-ops/follow/followings` | Get followings list of user/industry/university/business by actor | — |
| POST | `/interactive-ops/like` | Like/Dislike user/industry/university/business/service/product/comment by actor | — |
| GET | `/interactive-ops/like/dislikees` | Get dislikees list of user/industry/university/business by actor | — |
| GET | `/interactive-ops/like/dislikers` | Get dislikers list of user/industry/university/business/service/product/comment by actor | — |
| GET | `/interactive-ops/like/likees` | Get likees list of user/industry/university/business by actor | — |
| GET | `/interactive-ops/like/likers` | Get likers list of user/industry/university/business/service/product/comment by actor | — |
| POST | `/interactive-ops/score` | Score to industry/university/business/service/product by actor | — |
| GET | `/interactive-ops/score/average` | View Average score of industry/university/business/service/product | — |
| POST | `/interactive-ops/share` | Share user/industry/university/business/service/product page by actor | — |
| POST | `/interactive-ops/test_api` | this is sample for create api in django structure | Admin |

