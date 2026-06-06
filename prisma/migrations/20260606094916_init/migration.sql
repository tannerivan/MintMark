-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "subscriptionStatus" TEXT,
    "subscriptionEndsAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoinLookup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year" INTEGER NOT NULL,
    "mintMark" TEXT,
    "denomination" TEXT NOT NULL,
    "series" TEXT,
    "analysisJson" JSONB,
    "narrative" TEXT,
    "userId" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "CoinLookup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCoin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "lookupId" TEXT NOT NULL,
    "userNotes" TEXT,
    "grade" TEXT,
    "acquiredFor" DECIMAL(10,2),

    CONSTRAINT "SavedCoin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyChallenge" (
    "id" TEXT NOT NULL,
    "activeDate" DATE NOT NULL,
    "year" INTEGER NOT NULL,
    "mintMark" TEXT,
    "denomination" TEXT NOT NULL,
    "series" TEXT,
    "headline" TEXT NOT NULL,
    "teaser" TEXT NOT NULL,
    "funFact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "User_stripeCustomerId_idx" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "CoinLookup_userId_createdAt_idx" ON "CoinLookup"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CoinLookup_year_mintMark_denomination_idx" ON "CoinLookup"("year", "mintMark", "denomination");

-- CreateIndex
CREATE INDEX "SavedCoin_userId_idx" ON "SavedCoin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCoin_userId_lookupId_key" ON "SavedCoin"("userId", "lookupId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_activeDate_key" ON "DailyChallenge"("activeDate");

-- CreateIndex
CREATE INDEX "DailyChallenge_activeDate_idx" ON "DailyChallenge"("activeDate");

-- AddForeignKey
ALTER TABLE "CoinLookup" ADD CONSTRAINT "CoinLookup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCoin" ADD CONSTRAINT "SavedCoin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedCoin" ADD CONSTRAINT "SavedCoin_lookupId_fkey" FOREIGN KEY ("lookupId") REFERENCES "CoinLookup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
