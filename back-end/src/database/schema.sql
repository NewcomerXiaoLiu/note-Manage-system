-- 笔记分组表
CREATE TABLE IF NOT EXISTS `groups` (
  `id` TEXT PRIMARY KEY,
  `name` TEXT NOT NULL,
  `sort_order` INTEGER DEFAULT 0,
  `created_at` TEXT DEFAULT (datetime('now')),
  `updated_at` TEXT DEFAULT (datetime('now'))
);

-- 笔记表
CREATE TABLE IF NOT EXISTS `notes` (
  `id` TEXT PRIMARY KEY,
  `group_id` TEXT NOT NULL,
  `title` TEXT NOT NULL,
  `content` TEXT DEFAULT '',
  `created_at` TEXT DEFAULT (datetime('now')),
  `updated_at` TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE CASCADE
);
