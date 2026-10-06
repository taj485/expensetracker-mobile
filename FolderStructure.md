expensetracker-mobile/
├── .claude/
│   └── settings.json
├── .eas/
│   └── workflows/
│       └── release-ios.yml  EAS: build iOS and submit to TestFlight on push to main
├── .github/
│   └── workflows/
│       └── ci.yml           lint and type check on pull requests to main
├── assets/                  app icons and splash images
├── src/
│   ├── app/
│   │   ├── (app)/
│   │   │   ├── (tabs)/
│   │   │   │   ├── (home)/
│   │   │   │   │   ├── _layout.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── expenses/
│   │   │   │   │   ├── _layout.tsx
│   │   │   │   │   ├── [expenseId].tsx
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── receipt-edit.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   ├── _layout.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   └── _layout.tsx
│   │   │   ├── _layout.tsx
│   │   │   ├── add-expense.tsx
│   │   │   ├── create-first-space.tsx
│   │   │   ├── new-space.tsx
│   │   │   ├── scan.tsx
│   │   │   ├── share-space.tsx
│   │   │   ├── space-members.tsx
│   │   │   └── space-settings.tsx
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── config/
│   │   └── env.ts
│   ├── core/
│   │   ├── api/
│   │   │   ├── apiClient.ts
│   │   │   ├── apiErrors.ts
│   │   │   ├── downloadFile.ts
│   │   │   ├── downloadFile.web.ts
│   │   │   ├── queryClient.ts
│   │   │   └── useApiClient.ts
│   │   ├── auth/
│   │   │   ├── authConfig.ts
│   │   │   ├── authErrors.ts
│   │   │   └── useSession.ts
│   │   ├── models/
│   │   │   ├── expense-table.model.ts
│   │   │   └── expense.model.ts
│   │   ├── queries/
│   │   │   ├── expenseQueries.ts
│   │   │   ├── queryKeys.ts
│   │   │   └── spaceQueries.ts
│   │   ├── sample/
│   │   │   ├── sampleApiClient.ts
│   │   │   ├── sampleData.ts
│   │   │   ├── sampleFile.ts
│   │   │   └── sampleFile.web.ts
│   │   ├── services/
│   │   │   ├── expenseService.ts
│   │   │   └── expenseTableService.ts
│   │   ├── spaces/
│   │   │   └── SelectedSpaceProvider.tsx
│   │   └── utils/
│   │       ├── categoryUtils.ts
│   │       ├── dateUtils.ts
│   │       ├── expenseDraft.ts
│   │       ├── expenseUtils.ts
│   │       ├── formDataFile.ts
│   │       ├── formDataFile.web.ts
│   │       ├── merchantUtils.ts
│   │       ├── moneyUtils.ts
│   │       ├── spendingUtils.ts
│   │       └── uploaderUtils.ts
│   ├── features/
│   │   ├── add-expense/
│   │   │   ├── components/
│   │   │   │   ├── AmountField.tsx
│   │   │   │   └── ExpenseFormStep.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAddExpense.ts
│   │   │   └── AddExpenseSheet.tsx
│   │   ├── expense-detail/
│   │   │   ├── components/
│   │   │   │   ├── DetailHero.tsx
│   │   │   │   ├── ExpenseActionsMenu.tsx
│   │   │   │   └── ExpenseActionsMenu.web.tsx
│   │   │   └── ExpenseDetailScreen.tsx
│   │   ├── expenses/
│   │   │   ├── components/
│   │   │   │   ├── CategoryChips.tsx
│   │   │   │   ├── MonthChips.tsx
│   │   │   │   ├── ReceiptCard.tsx
│   │   │   │   ├── ReceiptItemRow.tsx
│   │   │   │   └── SpaceHeaderActions.tsx
│   │   │   ├── expenseFilters.ts
│   │   │   └── ExpensesScreen.tsx
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   ├── BalanceCard.tsx
│   │   │   │   ├── CategoryRow.tsx
│   │   │   │   ├── DailySpendChart.tsx
│   │   │   │   ├── HomeHeader.tsx
│   │   │   │   └── QuickAction.tsx
│   │   │   └── HomeScreen.tsx
│   │   ├── profile/
│   │   │   └── ProfileScreen.tsx
│   │   ├── receipt-edit/
│   │   │   ├── hooks/
│   │   │   │   ├── useEditReceipt.ts
│   │   │   │   └── useReceiptDownload.ts
│   │   │   └── EditReceiptScreen.tsx
│   │   ├── spaces/
│   │   │   ├── components/
│   │   │   │   ├── CreateSpaceForm.tsx
│   │   │   │   ├── MemberRow.tsx
│   │   │   │   ├── MembersList.tsx
│   │   │   │   ├── SelectSpacesStep.tsx
│   │   │   │   ├── SidebarNavItem.tsx
│   │   │   │   ├── SpaceRow.tsx
│   │   │   │   └── SpacesSidebar.tsx
│   │   │   ├── CreateFirstSpaceScreen.tsx
│   │   │   ├── NewSpaceSheet.tsx
│   │   │   ├── ShareSpaceSheet.tsx
│   │   │   ├── SpaceMembersSheet.tsx
│   │   │   ├── SpaceSettingsSheet.tsx
│   │   │   └── SpacesSidebarProvider.tsx
│   │   ├── upload-receipt/
│   │   │   ├── components/
│   │   │   │   ├── CameraPreview.tsx
│   │   │   │   ├── CaptureGuide.tsx
│   │   │   │   ├── CaptureStep.tsx
│   │   │   │   ├── ReadingStep.tsx
│   │   │   │   ├── ReceiptFrame.tsx
│   │   │   │   └── ReviewStep.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useCameraAccess.ts
│   │   │   │   ├── useConfirmDiscardDrafts.ts
│   │   │   │   └── useReceiptScan.ts
│   │   │   ├── utils/
│   │   │   │   └── receiptPhoto.ts
│   │   │   └── ScanReceiptSheet.tsx
│   │   └── welcome/
│   │       ├── components/
│   │       │   └── FeatureRow.tsx
│   │       └── WelcomeScreen.tsx
│   ├── shared/
│   │   ├── components/
│   │   │   ├── tab-bar/
│   │   │   │   ├── AppTabBar.tsx
│   │   │   │   ├── constants.ts
│   │   │   │   ├── ScanTabButton.tsx
│   │   │   │   └── TabBarItem.tsx
│   │   │   ├── AppText.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── CardStack.tsx
│   │   │   ├── CategoryBadge.tsx
│   │   │   ├── CategoryPicker.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Collapsible.tsx
│   │   │   ├── DateField.tsx
│   │   │   ├── ExpenseItemCard.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── KeyValueList.tsx
│   │   │   ├── MerchantLogo.tsx
│   │   │   ├── QueryState.tsx
│   │   │   ├── Screen.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── SheetHandle.tsx
│   │   │   ├── SheetHandle.web.tsx
│   │   │   ├── StatTile.tsx
│   │   │   ├── TextField.tsx
│   │   │   ├── UnderlineTabs.tsx
│   │   │   └── Wordmark.tsx
│   │   ├── icons/
│   │   │   ├── AppIcons.tsx
│   │   │   └── Mascot.tsx
│   │   ├── navigation/
│   │   │   └── useStackScreenOptions.ts
│   │   └── utils/
│   │       ├── confirm.ts
│   │       ├── confirm.web.ts
│   │       ├── saveFile.ts
│   │       └── saveFile.web.ts
│   └── theme/
│       ├── colors.ts
│       ├── index.ts
│       ├── spacing.ts
│       ├── typography.ts
│       └── useTheme.ts
├── .env.example
├── .gitignore
├── AGENTS.md
├── app.config.js
├── app.json
├── CLAUDE.md
├── eas.json
├── eslint.config.js
├── FolderStructure.md
├── LICENSE
├── metro.config.js
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
