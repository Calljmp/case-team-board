CREATE TABLE "users" ("id" integer primary key autoincrement, "email" text unique, "name" text, "avatar" text, "tags" jsonb, "created_at" timestamp default CURRENT_TIMESTAMP not null);

CREATE INDEX "users_email_index" on "users" ("email");

CREATE TABLE "users_auth_providers" ("id" integer primary key autoincrement, "user_id" integer not null references "users" ("id") on delete cascade, "auth_provider" text not null, "provider_user_id" text not null, "email" text, "email_verified" boolean default false, "password_hash" text, "auth_token" text, "created_at" timestamp default CURRENT_TIMESTAMP not null, constraint "auth_providers_unique" unique ("auth_provider", "provider_user_id"));

CREATE INDEX "users_auth_providers_user_id_auth_provider_index" on "users_auth_providers" ("user_id", "auth_provider");

CREATE INDEX "users_auth_providers_auth_token_index" on "users_auth_providers" ("auth_token");

CREATE TABLE "permissions" ("id" integer primary key autoincrement, "tag" text not null, "description" text, "table_name" text not null, "allow_select" boolean not null, "allow_insert" boolean not null, "allow_update" boolean not null, "allow_delete" boolean not null, "created_at" timestamp default CURRENT_TIMESTAMP not null, "restricted_columns" json default '[]' not null, constraint "permissions_tag_table_name" unique ("tag", "table_name"));

CREATE INDEX "permissions_tag_table_name" on "permissions" ("tag", "table_name");

CREATE TABLE "row_level_permissions" ("id" integer primary key autoincrement, "tag" text not null, "table_name" text not null, "apply_select" boolean not null, "apply_update" boolean not null, "apply_delete" boolean not null, "where_clause" text not null, "created_at" timestamp default CURRENT_TIMESTAMP not null, constraint "row_level_permissions_tag_table_name" unique ("tag", "table_name"));

CREATE INDEX "row_level_permissions_tag_table_name" on "row_level_permissions" ("tag", "table_name");

CREATE TABLE "buckets" ("id" integer primary key autoincrement, "name" text not null unique, "description" text, "created_at" timestamp default CURRENT_TIMESTAMP not null);

CREATE TABLE "buckets_file" ("id" integer primary key autoincrement, "key" text not null, "description" text, "tags" json default '[]', "type" text, "size" integer not null, "bucket_id" integer not null references "buckets" ("id") on delete cascade, "created_at" timestamp default CURRENT_TIMESTAMP not null, constraint "buckets_file_bucket_key_unique" unique ("bucket_id", "key"));

CREATE TABLE "storage_permissions" ("id" integer primary key autoincrement, "description" text, "tag" text not null, "bucket_id" integer not null references "buckets" ("id") on delete cascade, "allow_read" boolean not null, "allow_modify" boolean not null, "allow_add" boolean not null, "allow_delete" boolean not null, "created_at" timestamp default CURRENT_TIMESTAMP not null, constraint "storage_permissions_tag_bucket_id" unique ("tag", "bucket_id"));

CREATE INDEX "storage_permissions_tag_bucket_id" on "storage_permissions" ("tag", "bucket_id")