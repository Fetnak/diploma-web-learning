-- SETTING UP
-- Resetting public schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
	
-- Setting timezone
SET timezone = 'Europe/Minsk';

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM
CREATE TYPE user_role AS ENUM('administrator', 'teacher', 'student');


-- TABLES
CREATE TABLE groups (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    _name varchar(32) NOT NULL,
    specialty varchar(255), --специальность
    specialization varchar(255), --специализация,
    qualification varchar(255) --квалификация
);

ALTER TABLE groups
	ADD CONSTRAINT pk_groups PRIMARY KEY (_id);

CREATE TABLE users (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
	_login varchar(255) NOT NULL UNIQUE,
    _password varchar(128) NOT NULL,
    _name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    group_id uuid,
    avatarpath text,
    role user_role NOT NULL,
    activated bool DEFAULT true
);

ALTER TABLE users
	ADD CONSTRAINT pk_users PRIMARY KEY (_id),
    ADD CONSTRAINT fk_users_groups FOREIGN KEY (group_id) REFERENCES groups (_id);

CREATE TABLE secret_keys (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
	_key varchar(255) NOT NULL UNIQUE
);

ALTER TABLE secret_keys
	ADD CONSTRAINT pk_secret_keys PRIMARY KEY (_id);

CREATE TABLE sessions (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
	session_token varchar(196) NOT NULL,
    user_id uuid NOT NULL,
    expires_at timestamptz DEFAULT CURRENT_TIMESTAMP + '7 days' NOT NULL
);

ALTER TABLE sessions
	ADD CONSTRAINT pk_sessions PRIMARY KEY (_id),
    ADD CONSTRAINT fk_sessions_users FOREIGN KEY (user_id) REFERENCES users (_id) ON DELETE CASCADE;

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session"
	ADD CONSTRAINT pk_session PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX idx_session_expire ON "session" (expire);

CREATE TABLE files (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
    _name varchar(255) NOT NULL,
    mimetype varchar(255) NOT NULL,
    user_id uuid NOT NULL,
    filepath text NOT NULL,
    _public boolean DEFAULT false
);

ALTER TABLE files
	ADD CONSTRAINT pk_files PRIMARY KEY (_id),
    ADD CONSTRAINT fk_files_users FOREIGN KEY (user_id) REFERENCES users (_id);

CREATE TABLE subjects (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
	_name varchar(255) NOT NULL,
    short_name varchar(255) NOT NULL
);

ALTER TABLE subjects
	ADD CONSTRAINT pk_subjects PRIMARY KEY (_id);
	
CREATE TABLE documents (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
    _name varchar(255) NOT NULL,
    document_id uuid,
    subject_id uuid,
    group_id uuid,
    file_id uuid,
    _required boolean DEFAULT false
);

ALTER TABLE documents
	ADD CONSTRAINT pk_documents PRIMARY KEY (_id),
    ADD CONSTRAINT fk_documents_documents FOREIGN KEY (document_id) REFERENCES documents (_id),
    ADD CONSTRAINT fk_documents_subjects FOREIGN KEY (subject_id) REFERENCES subjects (_id),
    ADD CONSTRAINT fk_documents_groups FOREIGN KEY (group_id) REFERENCES groups (_id),
    ADD CONSTRAINT fk_documents_files FOREIGN KEY (file_id) REFERENCES files (_id);

CREATE TABLE history (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
    document_id uuid NOT NULL
);

ALTER TABLE history
	ADD CONSTRAINT pk_history PRIMARY KEY (_id),
    ADD CONSTRAINT fk_history_users FOREIGN KEY (user_id) REFERENCES users (_id),
    ADD CONSTRAINT fk_history_documents FOREIGN KEY (document_id) REFERENCES documents (_id);

CREATE TABLE messages (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
	sender_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    file_id uuid NOT NULL,
    sent_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE messages
	ADD CONSTRAINT pk_messages PRIMARY KEY (_id),
    ADD CONSTRAINT fk_messages_users1 FOREIGN KEY (sender_id) REFERENCES users (_id),
    ADD CONSTRAINT fk_messages_users2 FOREIGN KEY (recipient_id) REFERENCES users (_id),
    ADD CONSTRAINT fk_messages_files FOREIGN KEY (file_id) REFERENCES files (_id);

CREATE TABLE teaching_subjects (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
    subject_id uuid NOT NULL
);

ALTER TABLE teaching_subjects
	ADD CONSTRAINT pk_teaching_subjects PRIMARY KEY (_id),
    ADD CONSTRAINT fk_teaching_subjects_users FOREIGN KEY (user_id) REFERENCES users (_id),
    ADD CONSTRAINT fk_teaching_subjects_subjects FOREIGN KEY (subject_id) REFERENCES subjects (_id);

CREATE TABLE journal (
	_id uuid DEFAULT gen_random_uuid() NOT NULL,
    set_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    document_id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    student_id uuid NOT NULL,
    mark int NOT NULL
);

ALTER TABLE journal
	ADD CONSTRAINT pk_journal PRIMARY KEY (_id),
    ADD CONSTRAINT fk_journal_documents FOREIGN KEY (document_id) REFERENCES documents (_id),
    ADD CONSTRAINT fk_journal_users1 FOREIGN KEY (teacher_id) REFERENCES users (_id),
    ADD CONSTRAINT fk_journal_users2 FOREIGN KEY (student_id) REFERENCES users (_id);