-- Add indexes for frequently queried fields
-- ChurchCRM Genesis - Database Performance Optimization
-- Version: 1.1
-- Date: October 2025

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_full_name ON users(full_name);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Indexes for family_connections
CREATE INDEX IF NOT EXISTS idx_family_connections_user_id ON family_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_family_connections_related_user_id ON family_connections(related_user_id);

-- Indexes for user_tags
CREATE INDEX IF NOT EXISTS idx_user_tags_user_id ON user_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tags_tag_name ON user_tags(tag_name);

-- Indexes for growth_steps
CREATE INDEX IF NOT EXISTS idx_growth_steps_user_id ON growth_steps(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_steps_completed_at ON growth_steps(completed_at);

-- Indexes for groups
CREATE INDEX IF NOT EXISTS idx_groups_leader_id ON groups(leader_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups(created_at DESC);

-- Indexes for group_members
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON group_members(role);

-- Indexes for events
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

-- Indexes for event_volunteers
CREATE INDEX IF NOT EXISTS idx_event_volunteers_event_id ON event_volunteers(event_id);
CREATE INDEX IF NOT EXISTS idx_event_volunteers_user_id ON event_volunteers(user_id);

-- Indexes for check_ins
CREATE INDEX IF NOT EXISTS idx_check_ins_event_id ON check_ins(event_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_checked_in_at ON check_ins(checked_in_at DESC);

-- Indexes for message_templates
CREATE INDEX IF NOT EXISTS idx_message_templates_name ON message_templates(name);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_scheduled_at ON messages(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);
CREATE INDEX IF NOT EXISTS idx_messages_template_id ON messages(template_id);

-- Indexes for message_recipients
CREATE INDEX IF NOT EXISTS idx_message_recipients_message_id ON message_recipients(message_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_user_id ON message_recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_message_recipients_delivery_status ON message_recipients(delivery_status);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_group_members_group_user ON group_members(group_id, user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_sent ON messages(sender_id, sent_at DESC);

