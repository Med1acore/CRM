-- ChurchCRM Genesis - Политики безопасности для аутентификации
-- Версия: 1.0
-- Дата: 25.09.2025

-- Удаляем существующие политики (если есть)
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Everyone can view groups" ON groups;
DROP POLICY IF EXISTS "Leaders can update their groups" ON groups;
DROP POLICY IF EXISTS "Admins can insert groups" ON groups;
DROP POLICY IF EXISTS "Everyone can view events" ON events;
DROP POLICY IF EXISTS "Organizers can update their events" ON events;
DROP POLICY IF EXISTS "Admins can insert events" ON events;

-- Политики для таблицы users
-- Все аутентифицированные пользователи могут видеть всех пользователей
CREATE POLICY "Authenticated users can view all users" ON users 
FOR SELECT USING (auth.role() = 'authenticated');

-- Пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update own profile" ON users 
FOR UPDATE USING (auth.uid()::text = id);

-- Пользователи могут создавать свой профиль при регистрации
CREATE POLICY "Users can insert own profile" ON users 
FOR INSERT WITH CHECK (auth.uid()::text = id);

-- Политики для таблицы family_connections
CREATE POLICY "Users can view family connections" ON family_connections 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own family connections" ON family_connections 
FOR ALL USING (auth.uid()::text = user_id OR auth.uid()::text = related_user_id);

-- Политики для таблицы user_tags
CREATE POLICY "Users can view user tags" ON user_tags 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own tags" ON user_tags 
FOR ALL USING (auth.uid()::text = user_id);

-- Политики для таблицы growth_steps
CREATE POLICY "Users can view growth steps" ON growth_steps 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own growth steps" ON growth_steps 
FOR ALL USING (auth.uid()::text = user_id);

-- Политики для таблицы groups
-- Все аутентифицированные пользователи могут видеть группы
CREATE POLICY "Authenticated users can view groups" ON groups 
FOR SELECT USING (auth.role() = 'authenticated');

-- Лидеры могут обновлять свои группы
CREATE POLICY "Leaders can update their groups" ON groups 
FOR UPDATE USING (auth.uid()::text = leader_id);

-- Аутентифицированные пользователи могут создавать группы
CREATE POLICY "Authenticated users can create groups" ON groups 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Политики для таблицы group_members
CREATE POLICY "Users can view group members" ON group_members 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Group leaders can manage members" ON group_members 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM groups 
    WHERE groups.id = group_members.group_id 
    AND groups.leader_id = auth.uid()::text
  )
);

-- Политики для таблицы events
-- Все аутентифицированные пользователи могут видеть события
CREATE POLICY "Authenticated users can view events" ON events 
FOR SELECT USING (auth.role() = 'authenticated');

-- Организаторы могут обновлять свои события
CREATE POLICY "Organizers can update their events" ON events 
FOR UPDATE USING (auth.uid()::text = organizer_id);

-- Аутентифицированные пользователи могут создавать события
CREATE POLICY "Authenticated users can create events" ON events 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Политики для таблицы event_volunteers
CREATE POLICY "Users can view event volunteers" ON event_volunteers 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Event organizers can manage volunteers" ON event_volunteers 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = event_volunteers.event_id 
    AND events.organizer_id = auth.uid()::text
  )
);

-- Политики для таблицы check_ins
CREATE POLICY "Users can view check-ins" ON check_ins 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own check-ins" ON check_ins 
FOR ALL USING (auth.uid()::text = user_id);

-- Политики для таблицы message_templates
CREATE POLICY "Authenticated users can view message templates" ON message_templates 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage message templates" ON message_templates 
FOR ALL USING (auth.role() = 'authenticated');

-- Политики для таблицы messages
CREATE POLICY "Users can view messages" ON messages 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own messages" ON messages 
FOR ALL USING (auth.uid()::text = sender_id);

-- Политики для таблицы message_recipients
CREATE POLICY "Users can view message recipients" ON message_recipients 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Message senders can manage recipients" ON message_recipients 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM messages 
    WHERE messages.id = message_recipients.message_id 
    AND messages.sender_id = auth.uid()::text
  )
);

-- Функция для проверки роли администратора
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для проверки роли лидера
CREATE OR REPLACE FUNCTION is_leader()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'leader')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Дополнительные политики для администраторов
CREATE POLICY "Admins can manage all users" ON users 
FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage all groups" ON groups 
FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage all events" ON events 
FOR ALL USING (is_admin());

CREATE POLICY "Admins can manage all messages" ON messages 
FOR ALL USING (is_admin());
