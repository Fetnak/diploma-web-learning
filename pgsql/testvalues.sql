INSERT INTO groups (_id, _name, specialty, specialization, qualification)
VALUES
    ('9fe196f5-c269-4a34-826d-2f41cdc74c97', 'СП305', 'Программное обеспечение информационных технологий', 'Системное программирование', 'Техник-программист'),
    ('1ed07ac2-627d-46e0-b3a8-680adc99fdbf', 'СП405', 'Программное обеспечение информационных технологий', 'Системное программирование', 'Техник-программист');

INSERT INTO users (_id, _login, _password, _name, email, group_id, avatarpath, role)
VALUES
    ('070bedc3-4f1a-4076-9432-21ec7820770d', 'testadmin', '$2a$08$XDrfpGKZGwPKd4PYB2LpO.c2h87TaRXWj10CluoI1wp0K9ZPwJKbm', 'Осипов Бернар Закирович', 'testadmin@example.com', null, null, 'administrator'),
    ('371be351-3cde-4e6c-8177-18323de47c2a', 'testteacher1', '$2a$08$XDrfpGKZGwPKd4PYB2LpO.c2h87TaRXWj10CluoI1wp0K9ZPwJKbm', 'Федосеев Адольф Григорьевич', 'testteacher1@example.com', '9fe196f5-c269-4a34-826d-2f41cdc74c97', null, 'teacher'),
    ('f9d39983-a553-40e8-8fa3-d3b8f3a1e9d1', 'testteacher2', '$2a$08$XDrfpGKZGwPKd4PYB2LpO.c2h87TaRXWj10CluoI1wp0K9ZPwJKbm', 'Добровольская Кристина Константиновна', 'testteacher2@example.com', '1ed07ac2-627d-46e0-b3a8-680adc99fdbf', null, 'teacher'),
    ('f06c23bc-e434-4ac0-9950-abf25e3e49d4', 'teststudent1', '$2a$08$XDrfpGKZGwPKd4PYB2LpO.c2h87TaRXWj10CluoI1wp0K9ZPwJKbm', 'Милованов Бернар Егорович', 'teststudent1@example.com', '9fe196f5-c269-4a34-826d-2f41cdc74c97', null, 'student'),
    ('b8f06a1b-65d1-4b7c-85d7-da6675a34a8b', 'teststudent2', '$2a$08$XDrfpGKZGwPKd4PYB2LpO.c2h87TaRXWj10CluoI1wp0K9ZPwJKbm', 'Остимчук Кирилл Олегович', 'teststudent2@example.com', '1ed07ac2-627d-46e0-b3a8-680adc99fdbf', null, 'student');

INSERT INTO secret_keys (_key)
VALUES
    ('1234');

--INSERT INTO files

INSERT INTO subjects (_id, _name, short_name)
VALUES
    ('4868e53c-2b52-409c-a6a6-646b58e058ba', 'Программные средства создания интернет-приложений', 'ПССИП'),
    ('5a030da8-0ef3-4d0d-a863-46e3e6366ec2', 'Компьютерные сети', 'КС');

--INSERT INTO documents

--INSERT INTO history

--INSERT INTO messages

INSERT INTO teaching_subjects (_id, user_id, subject_id)
VALUES
    ('7417c948-0f55-4768-b522-01f03f022b32', '371be351-3cde-4e6c-8177-18323de47c2a', '4868e53c-2b52-409c-a6a6-646b58e058ba'),
    ('5a030da8-0ef3-4d0d-a863-46e3e6366ec2', 'f9d39983-a553-40e8-8fa3-d3b8f3a1e9d1', '4868e53c-2b52-409c-a6a6-646b58e058ba'),
    ('7d53ba16-7cd9-4693-84e1-14a5103ed82e', 'f9d39983-a553-40e8-8fa3-d3b8f3a1e9d1', '5a030da8-0ef3-4d0d-a863-46e3e6366ec2');








a2cfbc67-1aff-4d88-9bf8-d09af588514a

351f8063-64b4-4413-af94-669649b792a2

398cca63-65ad-486f-b062-2becb518bbdb

9feff34a-92ca-4e7e-8ef5-39c41e5c2d73

68be4e54-d037-4d65-9030-f810c5558c8d

ab6fb5de-519e-476f-ba5d-d07802db5d24

a94f15dd-5233-48c3-8b27-a364891c0a35

bb7cc333-25ff-42c7-aa3e-bf2c76f573bb

b2fac3bb-9a64-4d0d-952e-6fc3218e1af6

c132eddf-c0c5-4a0d-bba6-d64084b76569

07f6f390-40eb-4f10-bee5-71f7a2eca54c

a61b9cc3-b4db-4c70-b091-ea07b5e0aef0

e4cffc6d-5233-4268-8a8f-38285361c45a

ba55aa6f-ba31-45d5-a24b-afa0bb17e70e

20a163d9-e1ad-4ee3-8eeb-aeb4b6707c4f

97874e38-a44e-4bb2-8fbf-870737ee3e46

f02defd8-e503-41d3-846c-3fd5c26fabb0

0d1124b8-fd0b-45d2-ae1d-2a6ea595f637

74a2cb5b-d983-4101-9885-82fa78778893

f32dd7a9-7614-4181-8ae3-6aa2a92031f0

fd4567aa-f1c5-4c4a-8aae-909e4e892a34

ec865724-3be8-41c9-8179-71878149816e

7aafca31-5f93-43b1-9df7-cc9be15c25c7

c923afd0-92dc-44d3-8f74-3014d9149555

0d3ba998-2d4d-4eb8-bbe1-98a961ca0b23

7b4404ed-d4ef-4f5b-a95e-31cc798c96e6

07333e89-6510-42db-b85d-26d1a7efa8d7

f4048062-5d2a-4bc1-b053-264105ea22cf

53c36c47-76a4-4b49-85e0-b0db82342b5e

bee90197-adf9-4fbf-9a05-287e7ed1c38b

daabc36e-c8a8-4549-a4fc-4ba425447885

125b64ce-4d71-4068-b846-4b39d7ba7523

7ffaac80-1556-4b74-b049-07bfe2053cdc

8ade6bfd-bb3e-492a-aa13-de89425f1660

b43dec52-6474-42e9-95b4-8b683f7c9c0a

79de186d-513a-471d-b1e2-14c4a8c2a79c

02d03471-bc62-415b-9643-870763ed47df

5794dfdd-59dd-4102-82ab-ab9bed4db44f

0ece433d-92c5-4dd4-a326-7b252a77ebfe

30500256-873b-467f-9187-235722faa4ae

79e65d19-eb62-4462-8c1d-2fd3bab64ccb

30ce6943-7ba4-409b-836f-0126d3751db9

1ff8e696-f247-43a2-9a6a-003734fed63c

1457331b-0466-4d57-b842-48f52d58f5d5

76d54b27-c62a-4c8c-8774-3d59b50664e9

1f776549-2c5a-46ba-93da-c0e2c4bfb820

32c11786-5386-4095-8887-bbddcc2d97ad

365379c2-a171-4639-a4ed-5556914df241

1160d651-b060-4d7c-be5f-7cff244adee3

35c30d70-826d-41a5-aee6-452b63646c24

1223cc24-6fbc-44d6-9e24-b74e4afe5c24

b84a52f4-673d-463d-baef-2e75b48ec17a

a00d1069-591d-4fdb-9f96-eb8d029de801

3cc36f5e-972f-4c38-bcae-78fcd2a117e6

c5c266ba-f870-44c8-bc4c-9fb2a6613e45

1f6e5b2d-73b4-42b0-8755-3a4c94e8573a

c0f55cf2-bbcd-48a4-9e73-491e5f1fa5e5

ba3cd0dc-a3bb-4a7b-beaa-2d6d952332e7

cdc5b4da-5750-4d0f-ae03-db42375dca93

b70a8590-28b3-453c-bda3-9e3f692c5d61

f0dcb5fe-058b-4289-9861-868e714c009b

8cbbe3e1-887f-476a-8661-1f473dad700b

2c16bb3c-b9b8-4650-bbd9-f5f60aa9ab52

7086bd5c-7d1a-4c28-94a2-4b7e53a474a6

2c9762d7-2776-4cad-9621-ba3ae38b74ff

fd2be177-70ec-45d6-a5d1-787034f99798

b4f5b46f-433b-45f7-8a68-82dcffdc9e7e

c518484c-d00f-4e51-ac39-88f7d0d8b7c3

67974a76-36c6-46e6-8200-257786e4f6cf

75a46543-8e40-4eba-b5fa-9b9d766d3aa3

9bc0d10e-2927-4f75-8601-347cfdfe091a

6b40462f-cc11-4574-9baa-d85e15ea6e7e

2f503592-0ee8-45fd-a56a-218f61a241db

4e78bb28-bf7d-4e20-9825-8e046e538a1a

a8fa5a81-0733-43cf-a2d0-be9e47f2f5e8

cca6fcb0-cc04-4120-bfeb-bfa5eb8f22ed

d6136848-c1dd-4676-8795-b9b884bb9154

34e9b705-7f00-404b-92de-c07eb02175a0

e36ddf60-2f1d-48ac-a5e7-55facc87705e

b45cfb8b-1cd8-405b-8c36-012470714e4e

566a1fa7-5b0a-4044-8075-92086c8d0bbf

dcf8ce6d-bbcc-4ddb-94e2-809a24fa1015

641eb2bc-e4b0-40e2-a131-4dff1d637b59

eb1a8120-9ab9-4c15-8fd4-f22815470ee5

248e8292-cd4f-4a7c-afc6-6e387cd43862

55e77b86-1411-49c6-ba57-4a2ff8d6daec

c8429b23-def9-4185-a30d-bd2e95165dfc

5b74a9bc-611a-4df7-a980-d6ccbbe7b934

dfa8bc6f-0e0b-4a9a-b0bd-0b2be1231257