-- Development-only deterministic tenant data. Auth users are created through Supabase Auth tooling.
insert into public.roles (key,name,system) values ('owner','Owner',true),('administrator','Administrator',true),('manager','Manager',true),('supervisor','Supervisor',true),('employee','Employee',true),('contractor','Contractor',true),('accountant','Accountant',true) on conflict(key) do nothing;
insert into public.permissions (key,resource,action) values ('projects.read','projects','read'),('projects.manage','projects','manage'),('timesheets.read','timesheets','read'),('timesheets.submit','timesheets','submit'),('timesheets.approve','timesheets','approve'),('reports.read','reports','read'),('finance.read','finance','read'),('company.manage','company','manage') on conflict(key) do nothing;
insert into public.companies (id,name,vat,country,city) values ('00000000-0000-4000-8000-000000000001','BELNEX ENERGY','BE-DEMO-001','Belgium','Brussels'),('00000000-0000-4000-8000-000000000002','GeoTech','BE-DEMO-002','Belgium','Liège') on conflict(id) do nothing;
insert into public.company_relationships (source_company_id,target_company_id,relationship_type) values ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','contractor') on conflict do nothing;
insert into public.projects (id,company_id,client_company_id,name,status,estimated_hours) values ('00000000-0000-4000-8000-000000000101','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','Energy Site Modernization','active',720) on conflict(id) do nothing;
insert into public.sites (id,company_id,project_id,client_company_id,name,address,status) values ('00000000-0000-4000-8000-000000000201','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000101','00000000-0000-4000-8000-000000000002','GeoTech Main Site','{"city":"Liège","country":"Belgium"}','open') on conflict(id) do nothing;

insert into auth.users (
    instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,
    confirmation_token,recovery_token,email_change,email_change_token_new,
    email_change_token_current,phone_change,phone_change_token,
    reauthentication_token,raw_app_meta_data,raw_user_meta_data,created_at,updated_at
) values
('00000000-0000-0000-0000-000000000000','00000000-0000-4000-8000-000000001001','authenticated','authenticated','admin@nextime.local',crypt('nextime-local-only',gen_salt('bf')),now(),'','','','','','','','','{"provider":"email","providers":["email"]}','{"name":"Demo Administrator"}',now(),now()),
('00000000-0000-0000-0000-000000000000','00000000-0000-4000-8000-000000001002','authenticated','authenticated','supervisor@nextime.local',crypt('nextime-local-only',gen_salt('bf')),now(),'','','','','','','','','{"provider":"email","providers":["email"]}','{"name":"Demo Supervisor"}',now(),now()),
('00000000-0000-0000-0000-000000000000','00000000-0000-4000-8000-000000001003','authenticated','authenticated','employee@nextime.local',crypt('nextime-local-only',gen_salt('bf')),now(),'','','','','','','','','{"provider":"email","providers":["email"]}','{"name":"Demo Employee"}',now(),now()) on conflict(id) do nothing;
insert into public.users (id,name,email,country) values
('00000000-0000-4000-8000-000000001001','Demo Administrator','admin@nextime.local','Belgium'),
('00000000-0000-4000-8000-000000001002','Demo Supervisor','supervisor@nextime.local','Belgium'),
('00000000-0000-4000-8000-000000001003','Demo Employee','employee@nextime.local','Belgium') on conflict(id) do nothing;
insert into public.company_memberships (
    id,
    company_id,
    user_id,
    job_title,
    function_name,
    status
)
select
    v.id,
    v.company_id,
    v.user_id,
    v.job_title,
    v.function_name,
    v.status
from (
    values
        (
            '00000000-0000-4000-8000-000000002001'::uuid,
            '00000000-0000-4000-8000-000000000001'::uuid,
            '00000000-0000-4000-8000-000000001001'::uuid,
            'Administrator',
            'Operations',
            'active'::membership_status
        ),
        (
            '00000000-0000-4000-8000-000000002002'::uuid,
            '00000000-0000-4000-8000-000000000001'::uuid,
            '00000000-0000-4000-8000-000000001002'::uuid,
            'Supervisor',
            'Field Operations',
            'active'::membership_status
        ),
        (
            '00000000-0000-4000-8000-000000002003'::uuid,
            '00000000-0000-4000-8000-000000000001'::uuid,
            '00000000-0000-4000-8000-000000001003'::uuid,
            'Technician',
            'Field Operations',
            'active'::membership_status
        )
) AS v(
    id,
    company_id,
    user_id,
    job_title,
    function_name,
    status
)
where not exists (
    select 1
    from public.company_memberships m
    where m.company_id = v.company_id
      and m.user_id = v.user_id
      and m.status in ('invited','active','suspended')
);
insert into public.membership_roles (membership_id,role_id) select '00000000-0000-4000-8000-000000002001',id from public.roles where key='administrator' on conflict do nothing;
insert into public.membership_roles (membership_id,role_id) select '00000000-0000-4000-8000-000000002002',id from public.roles where key='supervisor' on conflict do nothing;
insert into public.membership_roles (membership_id,role_id) select '00000000-0000-4000-8000-000000002003',id from public.roles where key='employee' on conflict do nothing;
insert into public.employee_records (company_id,company_membership_id,job_title,employment_type,employment_status,start_date) values
    ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000002001','Administrator','employee','active','2025-01-06'),
    ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000002002','Supervisor','employee','active','2025-03-10'),
    ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000002003','Technician','employee','active','2025-06-01')
on conflict (company_membership_id) do nothing;
insert into public.timesheets (id,company_id,user_id,period_start,period_end,status,submitted_at) values ('00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000001003','2026-07-13','2026-07-19','submitted',now()) on conflict(id) do nothing;
insert into public.timesheet_entries (company_id,timesheet_id,project_id,site_id,starts_at,ends_at,break_minutes,notes) values ('00000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000301','00000000-0000-4000-8000-000000000101','00000000-0000-4000-8000-000000000201','2026-07-13 08:00:00+02','2026-07-13 16:30:00+02',30,'Development seed entry');
