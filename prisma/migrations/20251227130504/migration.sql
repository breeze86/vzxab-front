-- CreateIndex
CREATE INDEX `Admin_isActive_idx` ON `Admin`(`isActive`);

-- CreateIndex
CREATE INDEX `AdminSession_expiresAt_idx` ON `AdminSession`(`expiresAt`);

-- CreateIndex
CREATE INDEX `Review_isDeleted_createdAt_idx` ON `Review`(`isDeleted`, `createdAt`);

-- CreateIndex
CREATE INDEX `ReviewReply_reviewId_repliedAt_idx` ON `ReviewReply`(`reviewId`, `repliedAt`);
