CREATE TABLE `saved_anime` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`image_url` text NOT NULL,
	`score` integer NOT NULL,
	`episodes` integer NOT NULL,
	`format` text NOT NULL,
	`synopsis` text NOT NULL,
	`genres` text NOT NULL,
	`status` text NOT NULL,
	`rating` integer NOT NULL,
	`saved_at` integer NOT NULL
);
