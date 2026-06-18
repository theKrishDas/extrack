# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.4.0](https://github.com/thekrishdas/extrack/compare/v1.3.0...v1.4.0) (2026-06-18)

### Features

- **convex:** Add category-specific transaction listing ([91dd929](https://github.com/thekrishdas/extrack/commit/91dd929912bbdf0c3964585788b82e2345aab853)), closes [theKrishDas/extrack#87](https://github.com/theKrishDas/extrack/issues/87)
- **css:** add checkerboard utility class ([68c26d5](https://github.com/thekrishdas/extrack/commit/68c26d56ae667d39b923832180632ddf921c02d2)), closes [theKrishDas/extrack#88](https://github.com/theKrishDas/extrack/issues/88)
- **drawer:** add experimental dynamic drawer component ([60e94fc](https://github.com/thekrishdas/extrack/commit/60e94fc6c46e6a6c1cc2404f8f03a2f8a7f507fb)), closes [theKrishDas/extrack#82](https://github.com/theKrishDas/extrack/issues/82)
- **icons:** Add transaction type icon component ([7f10c3e](https://github.com/thekrishdas/extrack/commit/7f10c3e7d0fc5b7393424b3b6dd39d690b570b84)), closes [theKrishDas/extrack#86](https://github.com/theKrishDas/extrack/issues/86)
- **settings:** Add detailed category management UI ([7e0e57d](https://github.com/thekrishdas/extrack/commit/7e0e57da31a6e80f19346e365a7589836882e24e)), closes [theKrishDas/extrack#93](https://github.com/theKrishDas/extrack/issues/93)
- **settings:** add edit category drawer ([05ec8f3](https://github.com/thekrishdas/extrack/commit/05ec8f3f95c1d43bffba865c7d0fc1f74def1a97)), closes [theKrishDas/extrack#93](https://github.com/theKrishDas/extrack/issues/93)
- **ui:** add color-to-CSS-var utility ([db3a764](https://github.com/thekrishdas/extrack/commit/db3a764ad9596a3be359ec0e54b6a67b508d98be)), closes [theKrishDas/extrack#92](https://github.com/theKrishDas/extrack/issues/92)

## [1.3.0](https://github.com/thekrishdas/extrack/compare/v1.2.0...v1.3.0) (2026-06-05)

### Features

- **hooks:** add controllable state hook ([9246a90](https://github.com/thekrishdas/extrack/commit/9246a90))

### Bug Fixes

- **ui:** make delete button red to fix low-contrast appearance ([5fbc07e](https://github.com/thekrishdas/extrack/commit/5fbc07e))

### Internal

- **ci(biome):** enforce unused import detection without auto-fix ([f1c09f9](https://github.com/thekrishdas/extrack/commit/f1c09f9))
- **header:** extract avatar constants and improve styling ([1bdbc7c](https://github.com/thekrishdas/extrack/commit/1bdbc7c))
- **profile:** replace custom avatar with Base UI Avatar component ([6ab679f](https://github.com/thekrishdas/extrack/commit/6ab679f))
- **user:** extract avatar fallback delay to shared constant ([c3edbbf](https://github.com/thekrishdas/extrack/commit/c3edbbf))

## [1.2.0](https://github.com/thekrishdas/extrack/compare/v1.1.0...v1.2.0) (2026-05-29)

### Features

Got it. Here are the reworded points:

- **ui:** add toast notification for transaction creation ([ff0e3f8](https://github.com/thekrishdas/extrack/commit/ff0e3f8164f4ff5c94b7330307de0ef56bc40bf5))
- **ui:** categories settings now has a segmented control to switch between Expense and Income categories ([995285d](https://github.com/thekrishdas/extrack/commit/995285db5b5c2dcf59def3b5e270ab55d2c22379))
- **ui:** show a toast notification when a transaction fails to save ([a25b58b](https://github.com/thekrishdas/extrack/commit/a25b58bb6f2e4611ea0df32a953f528463ab17e4))
- **ui:** top header settings button now shows your profile picture instead of a generic icon ([b4c04d9](https://github.com/thekrishdas/extrack/commit/b4c04d99a35f00b5dbffb1c1881e8c255051f153))

### Bug Fixes

- **appearance:** rename "Auto" to "System" in theme switcher ([bf5d787](https://github.com/thekrishdas/extrack/commit/bf5d787b221b32f0c1277b3808859e96b69643f3)), closes [theKrishDas/extrack#74](https://github.com/theKrishDas/extrack/issues/74)
- **emoji:** improve accessibility and semantic markup ([aa5a060](https://github.com/thekrishdas/extrack/commit/aa5a06069c67099fe3969b4334d776ae9ac6c6bc)), closes [theKrishDas/extrack#75](https://github.com/theKrishDas/extrack/issues/75)
- **inset-list:** prevent horizontal scroll with visuallyHidden ([4704ecc](https://github.com/thekrishdas/extrack/commit/4704ecc2ff6983877a392ecb727c6fa57cc067ea))
- **toasts:** route app toasts through default toaster ([12efc48](https://github.com/thekrishdas/extrack/commit/12efc485b238a9dde7fdc4450016bd62dc9a89c6))
- **ui:** show error toast when account deletion fails ([124a376](https://github.com/thekrishdas/extrack/commit/124a37646b756c70c0a766335192fb797abd98f5))

## [1.1.0](https://github.com/thekrishdas/extrack/compare/v1.0.0...v1.1.0) (2026-05-22)

### Features

- **brand:** replace single favicon with multi-resolution favicon set ([0e0dfe6](https://github.com/thekrishdas/extrack/commit/0e0dfe6541dd99ba42fa5d645f3e5c35e7a8545e))
- **convex:** Add limit and sort to transactions ([d250974](https://github.com/thekrishdas/extrack/commit/d2509741e460475517193d0b2da6c03cf6b8bb2a))
- **dev:** add dynamic favicon component for development ([4349002](https://github.com/thekrishdas/extrack/commit/434900216e72ce5e1b1b24808efb5b4a2b4acd55))
- **home:** Add loading and empty states to dashboard ([04ff37e](https://github.com/thekrishdas/extrack/commit/04ff37e18fcdd671759c5ca4fce2acfb916edf4e))
- **onboarding:** add onboarding flow for new sign-ups ([3ef88cf](https://github.com/thekrishdas/extrack/commit/3ef88cf7d9e654dbf0792a5ba03d86b3dc8db20d)), closes [theKrishDas/extrack#59](https://github.com/theKrishDas/extrack/issues/59)
- **pwa:** configure PWA manifest and app icons ([8c8322d](https://github.com/thekrishdas/extrack/commit/8c8322dac322d84d63b3cd63888f575cac0b3350))
- **ui:** add shiny text animation component ([6218420](https://github.com/thekrishdas/extrack/commit/62184208aacd35c99ead81f14d9b977c71141d4f))
- **ui:** Add splash screen component ([56cddbf](https://github.com/thekrishdas/extrack/commit/56cddbf96757b0790ddd43ebeaf217f71ed6aa50))

### Bug Fixes

- **summary:** show neutral icon for zero delta ([36fa53f](https://github.com/thekrishdas/extrack/commit/36fa53f7db33b86d448cf40dfc394b8adb7da7e2))

## 1.0.0 (2026-05-07)

### ⚠ BREAKING CHANGES

- **convex:** api.account.getBalance now accepts "\*" instead of "combined"
- **convex:** Complete schema migration requiring data reset

Schema Changes:

- Transactions:
  - Add `date` field (replaces `_creationTime`)
  - Add `ownerId` for user ownership
- Categories:
  - Add `ownerId`, `is_vendor`, `icon` fields
- Accounts:
  - Add `ownerId`, `is_default`, `icon` fields
- All tables: updated indices

Implementation:

- Updated all queries for new schema
- Refactored components to use new queries
- Added proper type definitions

* **convex:** - Transaction `category` and `account` fields now return full documents instead of IDs

- Requires new dependency: `convex-helpers`

- Implement paginated query using convex streams
- Perform 1:1 joins with categories/accounts tables
- Return enriched transaction objects with embedded relations

* **db:** Existing UI queries are now incompatible.
  Temporary UI breakage expected until data structure is finalized.
  Will be fixed in subsequent update.

### Features

- **account:** add bare new account creation form ([b40001c](https://github.com/thekrishdas/extrack/commit/b40001c937c0e0170766c1b1facc44b6172ebce0))
- **account:** enhance new-account form with emoji picker & toast ([5e946d0](https://github.com/thekrishdas/extrack/commit/5e946d0a9ea166e22271b69f8da7c575751a20dd))
- **accounts:** add account limit indicator and circular meter ([81e3f2f](https://github.com/thekrishdas/extrack/commit/81e3f2f12df33ef578aaebf2a7c38480779ab824))
- **accounts:** add active/default toggles with Switch ([eedbc48](https://github.com/thekrishdas/extrack/commit/eedbc48a1846f6b9e48bfdc787e223398d73503d))
- **accounts:** add updateCurrentBalance mutation and balance constraints ([fdc433c](https://github.com/thekrishdas/extrack/commit/fdc433ce468c1388f24dcdc91f405684fe5203ba))
- **activities:** add detail drawer and refactor for performance ([95cd437](https://github.com/thekrishdas/extrack/commit/95cd4375c13ec708ab7e18aba566916679d990ad))
- **activity:** add infinite transaction list ([854fc6e](https://github.com/thekrishdas/extrack/commit/854fc6e946475b5a9948365ae84dead139b23f20))
- **activity:** add transaction detail drawer ([4f0d424](https://github.com/thekrishdas/extrack/commit/4f0d4245e2318b2a16a603a5eccae8e810e9e0b4))
- **activity:** add transaction type filtering with query param tabs ([9377990](https://github.com/thekrishdas/extrack/commit/93779904b519c1b3d48dde36a70bf5107ccb52b4))
- add a Container component for layout ([5c40afd](https://github.com/thekrishdas/extrack/commit/5c40afd6718f14acb25b6adac6461e196b18a149))
- add a drawer to display more info about the transaction ([c728c40](https://github.com/thekrishdas/extrack/commit/c728c40b896c7c156b6d768b1865891c4d518171))
- add a heading to the transactions list ([e7ebec3](https://github.com/thekrishdas/extrack/commit/e7ebec3b1dbc032dff6ce911a646300106dcd980))
- add a list component to display all the transactions ([d787f9d](https://github.com/thekrishdas/extrack/commit/d787f9dc0d2b2de133b0117333d8b1c0f4556705))
- add a page (ui/buttons) to render all the buttons ([405d4d1](https://github.com/thekrishdas/extrack/commit/405d4d1df552371a010cbca7623e8b2bb162bce3))
- add a re-usable drawer component ([a1edfa3](https://github.com/thekrishdas/extrack/commit/a1edfa3753284595a4a1c2eb340a8a60ddf9fc51))
- add a table component (not re-usable) ([9878e59](https://github.com/thekrishdas/extrack/commit/9878e599404733c86f70a98a3e5d95726a191af6))
- add ability to add a note ([99377d0](https://github.com/thekrishdas/extrack/commit/99377d0decda819801123b4720414b1157041dd0))
- add ability to select account ([0b9f586](https://github.com/thekrishdas/extrack/commit/0b9f586730b10d035dc0de74aa4da4adcae6e20e))
- add accounts table and bind it with new transactions ([b18874f](https://github.com/thekrishdas/extrack/commit/b18874fadcec2cd611e3e12af01c9d853ce8b443))
- add animated container that resizes when the content changes ([8ba8ae0](https://github.com/thekrishdas/extrack/commit/8ba8ae0ee8f44666f581dae5c1146660b7e26f8f))
- add Clerk webhook endpoint for Convex ([3a8c4e4](https://github.com/thekrishdas/extrack/commit/3a8c4e4ab0c76f0f23fedb91e3fbd51c060dbe8d))
- add confirm button ([7eb02a4](https://github.com/thekrishdas/extrack/commit/7eb02a42b36e6003151515dff3e55a02c32d4155))
- add constants, schema and types to work with categories ([71a22f3](https://github.com/thekrishdas/extrack/commit/71a22f3ca03872085c53f98a2fb96fd93b3b2d40))
- add detailed info in the summary querry ([deaf2f1](https://github.com/thekrishdas/extrack/commit/deaf2f17f1e6036180c4586c5fb14ca5b9767b23))
- add FAB component using Base UI Popover ([85e454d](https://github.com/thekrishdas/extrack/commit/85e454dde59e1a4ca5e9e82b5544b91016a8a859))
- add first draft of the copy or edit component ([83c5763](https://github.com/thekrishdas/extrack/commit/83c576359c55885ea2fa487dd7c0c3aee6887518))
- add FloatingNav and Header to app layouts ([95e11f3](https://github.com/thekrishdas/extrack/commit/95e11f3c7336b9bdb65998e3d796f006763db8ba))
- add form in the vaul drawer ([72d34cc](https://github.com/thekrishdas/extrack/commit/72d34ccc527404578d5efd34d7593a19543774ba))
- add functionality to add new transactions ([9821ce8](https://github.com/thekrishdas/extrack/commit/9821ce84e34440325d3fa696ff0dad505f7d2f92))
- add functionality to add note to the transaction ([b7faa38](https://github.com/thekrishdas/extrack/commit/b7faa38124f2660b37dfebbc3b03917e59d5d7fa))
- add functionality to add or remove transactions ([18a6bf6](https://github.com/thekrishdas/extrack/commit/18a6bf6f396970725d8149280007981b1bc0df49))
- add header and improve page layouts ([f108b90](https://github.com/thekrishdas/extrack/commit/f108b90b00acb83ed3d260c882415c355f861305))
- add lib function to generate colors from one base color ([70a9a8f](https://github.com/thekrishdas/extrack/commit/70a9a8f7c4dee6181be3ba223483ae7712bfd30b))
- add list component ([c808754](https://github.com/thekrishdas/extrack/commit/c808754b80233b8c61e9e9717f476727cd9fb6f2))
- Add listbox to be able to select the categories ([da09abb](https://github.com/thekrishdas/extrack/commit/da09abb22ed2e7c50239be8ffef8163f489882aa))
- add material component ([e9fb311](https://github.com/thekrishdas/extrack/commit/e9fb311a3619be5eb007a3e0b377ed79e4a4dd0e))
- add max char limit to note while adding a new transaction ([cd54064](https://github.com/thekrishdas/extrack/commit/cd54064ffde4c8723fbadb9b59177882087be17f))
- add new chrome variant to the material ([de41afb](https://github.com/thekrishdas/extrack/commit/de41afb94149d9a5a0b08bc249773b15aedefd59))
- add querry to get analytics for given categories ([31cbe79](https://github.com/thekrishdas/extrack/commit/31cbe79690187d0ef5a7a4bfd5737ca90205ac54))
- add querry to get highest transaction amount within given dates ([9a26c93](https://github.com/thekrishdas/extrack/commit/9a26c9389f73c4de9b3f50a8e18bb6909c810b9e))
- add query to get total done transaction amount within given date ([3bb5b20](https://github.com/thekrishdas/extrack/commit/3bb5b20c79f78bffd782425368e60b0207d17552))
- add runtime variables ([9b36df5](https://github.com/thekrishdas/extrack/commit/9b36df508c41fe2da8758c7a5b64f5392b6d6971))
- add squircle CSS utility ([01f8b48](https://github.com/thekrishdas/extrack/commit/01f8b4848592d84d582c0e370d70457d2544e41b))
- add tailwind color variables ([0140559](https://github.com/thekrishdas/extrack/commit/01405597bea4c3164e73276bedc98be84ef134b7))
- add temporary error page for development ([c54ed78](https://github.com/thekrishdas/extrack/commit/c54ed784483a5ce07b204b6c9fc3f59dcc476016))
- add the confirm button on the expantion drawer ([46fc009](https://github.com/thekrishdas/extrack/commit/46fc009c32b2ed44653bd7e6c463682b3b5ce27f))
- add the dock ([a27e7a3](https://github.com/thekrishdas/extrack/commit/a27e7a3a20207012cfa61264a91cd8643e11b146))
- add the FAB in the doc ([ba9c173](https://github.com/thekrishdas/extrack/commit/ba9c173c173cc6a03ca750833867d53b74a1280f))
- add the layout for the transaction-summary ([6f2e822](https://github.com/thekrishdas/extrack/commit/6f2e822511e1bb4addbb292691de2502dd4abbcb))
- add the Nav in vaul ([09e7b59](https://github.com/thekrishdas/extrack/commit/09e7b594d2d8a54e3ef6b8eba9a943c6d18f48a7))
- add the new dock design ([5f50356](https://github.com/thekrishdas/extrack/commit/5f503565a1405f5853fbfbabb0b85a05b6d94a0c))
- add the Prettify type helper ([200251b](https://github.com/thekrishdas/extrack/commit/200251b952bd8a132ddf9db97390eedb598ea71f))
- add two more indexing criteria in transactions ([685b0d5](https://github.com/thekrishdas/extrack/commit/685b0d5483f062abbfff5774bd04d4168ba94fbb))
- add user settings and default account ([7b25eea](https://github.com/thekrishdas/extrack/commit/7b25eea36dfedb11b49a655f8bcbdde6905ed3ba))
- add utils function ([b272b97](https://github.com/thekrishdas/extrack/commit/b272b97f270009cf2a7b7ed610a94d74dc10ea48))
- auto-onboard new users with default accounts and categories ([ae6c115](https://github.com/thekrishdas/extrack/commit/ae6c115da618211c8d40238741d87bb4e5746ebe))
- **balance-display:** add balance display and style component ([6ec27fb](https://github.com/thekrishdas/extrack/commit/6ec27fb8383ec54a8ed1d3036569539e651a47fe))
- **balance:** animate balance and diff with NumberFlow ([7b4c2f1](https://github.com/thekrishdas/extrack/commit/7b4c2f1e71e93664666fadbaa76dc21d1c1f8865))
- cache activities query subscription ([43d5fec](https://github.com/thekrishdas/extrack/commit/43d5fec17a77f5c51a4bea19ead261bb7b8f8c87))
- cache queries for faster response ([1ebda0d](https://github.com/thekrishdas/extrack/commit/1ebda0d4ae9e547390000a86825b42b1a15a449b))
- **category:** enforce per-user category limit with tests ([388e8e4](https://github.com/thekrishdas/extrack/commit/388e8e46ce670a1b074e1bf9cd2e792712b8ee8d))
- **charts:** add balance trend chart component ([f035a91](https://github.com/thekrishdas/extrack/commit/f035a919d267f604bb534f300a0e107342724bb4))
- **charts:** add ChartProps type for dimension-aware components ([39c887f](https://github.com/thekrishdas/extrack/commit/39c887f8ef7bcec783a1e1dc4642ad1c5ea13178))
- **charts:** add daily balance timeline builder ([05d2789](https://github.com/thekrishdas/extrack/commit/05d278942d20c94a4ff97284997ea2675b5b6e12))
- **charts:** add remaining balance visualization ([5172ab1](https://github.com/thekrishdas/extrack/commit/5172ab19000cb314a9558262f7c59aee4628df5d))
- **charts:** add weekly average visualization ([484a6a1](https://github.com/thekrishdas/extrack/commit/484a6a16dc3b095b9fe6bdc79a6c69f53542231a))
- **charts:** connect balance trend to real data ([56ec426](https://github.com/thekrishdas/extrack/commit/56ec42621883c6bec082f84005b0dee4e91f1b2b))
- **charts:** improve weekly average display with responsive sizing ([41002b6](https://github.com/thekrishdas/extrack/commit/41002b6ad4f9bd967cebb30109d6f20751cc7683))
- **charts:** replace dummy data with real transactions ([09cda88](https://github.com/thekrishdas/extrack/commit/09cda888707c4ec787c6ccfeeb4ea10a169fff41))
- **charts:** replace dummy spending pace with real transaction data ([fe20d27](https://github.com/thekrishdas/extrack/commit/fe20d27d9336f576f87eb01c05e960eed831fb2e))
- **charts:** replace spinner with skeleton loaders in weekly average ([a6f9b42](https://github.com/thekrishdas/extrack/commit/a6f9b42a5bb7a001093026dd0e88fa6cf44a5115))
- close drawer when add a new transaction ([8bc3920](https://github.com/thekrishdas/extrack/commit/8bc392048602d9d3e39a3df9e0419549205c67ae))
- **colors:** add elevated background colors ([a0a06f3](https://github.com/thekrishdas/extrack/commit/a0a06f3aa1d17824d4b8d3a321c23e5207dd5cb6))
- connect FAB to transaction form via drawer ([213a512](https://github.com/thekrishdas/extrack/commit/213a512c4dcffd2b06fbc98490dcc1c53957a909))
- connect the amount input with react-hook-forms ([8a91f84](https://github.com/thekrishdas/extrack/commit/8a91f844f03ecddd04aa5d6e1c4db0ca8cccd05e))
- **convex:** add account balance query ([0ef92cc](https://github.com/thekrishdas/extrack/commit/0ef92cc8ce18c7ff9b9e0e3c99810a549f0cef96))
- **convex:** add auth preloading utilities and context provider ([3c94f19](https://github.com/thekrishdas/extrack/commit/3c94f1937952c4fee0680c23ba568a7f012c1aa9))
- **convex:** add doc existence and ownership helper ([d078f45](https://github.com/thekrishdas/extrack/commit/d078f4511f673b806bea8aab51f97475b3d4693c))
- **convex:** add internal balance sync mutation ([e7589c3](https://github.com/thekrishdas/extrack/commit/e7589c3081230899ccd41dd38b1558c9f3bc09b6))
- **convex:** add min/max flow to util function for summary ([01fca6d](https://github.com/thekrishdas/extrack/commit/01fca6dd9121069a63e54704d63f5ecf03e6b71f))
- **convex:** add paginated query with joined relations ([8fbf96e](https://github.com/thekrishdas/extrack/commit/8fbf96e6825c020880e5db742d3cc0b30285ed5b))
- **convex:** add query for most used categories by transaction type ([1f94aed](https://github.com/thekrishdas/extrack/commit/1f94aedac5d1dfcd94fbb63b042c695998ff51f7))
- **convex:** add user-scoped helpers ([7ec6053](https://github.com/thekrishdas/extrack/commit/7ec60537f7d840aecd13bb109876726713a67e43))
- **convex:** add zod validation for account, category, and transaction mutations ([3f65c1d](https://github.com/thekrishdas/extrack/commit/3f65c1d5149381014780f001088319520963a093))
- **convex:** extend category query to support account filtering ([60033e1](https://github.com/thekrishdas/extrack/commit/60033e1a6bc802624e2e66f17acd770e33eeaf0f))
- **convex:** improve getBalance query with auth checks and optimization ([4a6748d](https://github.com/thekrishdas/extrack/commit/4a6748d22396f99d8ec07bdc2e6db81eea5b135d))
- **convex:** overhaul database schema with ownership and metadata ([d92f69d](https://github.com/thekrishdas/extrack/commit/d92f69d2b106d23e0f6ceb8c933d567c617881fc))
- **currency:** allow custom options in currency formatter ([40e56ac](https://github.com/thekrishdas/extrack/commit/40e56ac99513a3104cdea9c053e3b63cbb689842))
- display account and category in the expantion drawer ([42ca68f](https://github.com/thekrishdas/extrack/commit/42ca68f2da928190dbf7d01dd27986b9bfd7fa92))
- display grouped transactions in the main page ([70857a5](https://github.com/thekrishdas/extrack/commit/70857a58aa7c1d193ac6ea7b77d4e95423e7b775))
- display the current balance in the summary page ([42f6943](https://github.com/thekrishdas/extrack/commit/42f6943ef5ca95550253970f9ed6aab678102598))
- enforce user authentication in Convex functions ([107df72](https://github.com/thekrishdas/extrack/commit/107df727073c29136a72d881f0714c89c31906a3))
- **error:** handle missing user during onboarding ([6e3cef6](https://github.com/thekrishdas/extrack/commit/6e3cef6c4f01e23aef619cf983efcd0e7ada87fb))
- first draft of the button ([e60f786](https://github.com/thekrishdas/extrack/commit/e60f7865ad504827ec42425cc3b6ada6fd1ba3fa))
- **flow-summary:** animate flow metrics with @number-flow/react ([8051189](https://github.com/thekrishdas/extrack/commit/805118996e96792ddb973e0d96f67a5402b7a535))
- **form/account:** wire new-account form to Convex add mutation ([4960b0f](https://github.com/thekrishdas/extrack/commit/4960b0f2a11b363e73755fec828fa6085d953413))
- install and use vaul drawer ([258bab2](https://github.com/thekrishdas/extrack/commit/258bab2a413d9c41040565f6821f197376b2253d))
- install react-hook-form and resolvers ([3446fc7](https://github.com/thekrishdas/extrack/commit/3446fc762c937acd2feecef95769acf9a999d219))
- integrate Clerk authentication with Convex ([a4bdb1c](https://github.com/thekrishdas/extrack/commit/a4bdb1cc4609e76f719c6dbb9966b80bc4ac0692))
- integrate convex and add schema for transaction table ([8f1f57b](https://github.com/thekrishdas/extrack/commit/8f1f57bd360ccd11d44d20571094808affc77913))
- itegrate the new dock and fab with the page ([0e8c290](https://github.com/thekrishdas/extrack/commit/0e8c290e3c43de2523c50ca904e63d589733a675))
- **lib:** add color constants and seed data to shared library ([5b85445](https://github.com/thekrishdas/extrack/commit/5b85445d5eaff80246aebc4b26e82fd9c446ee3a))
- **lib:** add shared constants library and path aliases ([c891283](https://github.com/thekrishdas/extrack/commit/c8912831b9ce90979f5f15a3c8077b616a741e89))
- **lib:** add shared Zod validators for cents and names ([14c0215](https://github.com/thekrishdas/extrack/commit/14c02150faa04721fddba1b28b055d7eca395ab2))
- **lib:** add typed error system with AppError and factories ([c9edeff](https://github.com/thekrishdas/extrack/commit/c9edeff494997c6c01256aa8c67b2c8b51b2a3b1))
- **migrations:** add data migration system for legacy database ([158bbf5](https://github.com/thekrishdas/extrack/commit/158bbf5d2b70f1546bab686327ddd70f8d8a9522))
- **migrations:** export migration runner for users table ([8b5eb4e](https://github.com/thekrishdas/extrack/commit/8b5eb4e25a3a45ddb8ed3ae0520484fe327c16ff))
- **onboarding:** add recovery flow for incomplete account setup ([e452952](https://github.com/thekrishdas/extrack/commit/e452952301aa8d30ae5872a092d4ca83101f9e03))
- **onboarding:** add retry endpoint for failed user setup ([46359b5](https://github.com/thekrishdas/extrack/commit/46359b5e1c6344228f296182a52ee389d8f6bb30))
- **perf:** add Vercel Speed Insights ([073afcf](https://github.com/thekrishdas/extrack/commit/073afcf2ea359ddb629417312a8519e975e8f9d3))
- **provider:** integrate react-aria RouterProvider with Next.js router ([382a0f4](https://github.com/thekrishdas/extrack/commit/382a0f470e8ed0804b7f9128f061e94c6b04e102))
- **query-param-tabs:** add animated segmented control tabs with motion pill ([053c90b](https://github.com/thekrishdas/extrack/commit/053c90bc360c4500bd3de1123d9ea2634fbce09c))
- **runtime:** show app version in settings ([ca83a81](https://github.com/thekrishdas/extrack/commit/ca83a81cb88d2b598c7a37cf1e18667d476372c2))
- **schema:** add migration support for legacy data ([c82de2c](https://github.com/thekrishdas/extrack/commit/c82de2cd311c6adfa27b2940ccdab33fac177e04))
- second draft of the button ([4fe4bf6](https://github.com/thekrishdas/extrack/commit/4fe4bf69ff151e48defc352f32c2ab44992efccf))
- **settings/accounts:** enable account deletion in details page ([be35ac3](https://github.com/thekrishdas/extrack/commit/be35ac373224c828f3803d48c96d23adc66575df))
- **settings/accounts:** enable inline edit of account name and icon ([3b295f0](https://github.com/thekrishdas/extrack/commit/3b295f0d0ba68f128f80d0f72c7e0c3c635b1e73))
- **settings/accounts:** modularize account list and add-account flow ([2b832d9](https://github.com/thekrishdas/extrack/commit/2b832d9f1c92e62b8f63aa3fc9ae95c89c6d8ce7))
- **settings/accounts:** scaffold dynamic account detail page ([806645a](https://github.com/thekrishdas/extrack/commit/806645ab2923252ee6e964ea2f44a891dd8a9a82))
- **settings/accounts:** scaffold temporary `/settings/accounts/id` placeholder page ([535f4b5](https://github.com/thekrishdas/extrack/commit/535f4b5bbc50222083d4f661d8eb88bb17189137))
- **settings/categories:** enable category deletion ([057f642](https://github.com/thekrishdas/extrack/commit/057f6424cfd8b29b93009dd0574ecc585e2e1a5a))
- **settings/categories:** enable edit of category name, icon & color ([b966121](https://github.com/thekrishdas/extrack/commit/b966121fd80dcd8e255eef6a06c4346dbfbaa984))
- **settings/categories:** use new ActionDrawer for category actions ([89c1f4b](https://github.com/thekrishdas/extrack/commit/89c1f4bdd46af8f55aab649e5b13039517a60e69))
- **settings:** add account settings page ([e67d1a9](https://github.com/thekrishdas/extrack/commit/e67d1a9c88c5c6dc351fa5217bc633cd5cbdee18))
- **settings:** add contact developer page ([f4485d1](https://github.com/thekrishdas/extrack/commit/f4485d18908844c828668fc7714baaabc709c127))
- **settings:** add profile settings page with Clerk user info and sign out ([680deab](https://github.com/thekrishdas/extrack/commit/680deabd7f97a20968ba2d9cb4f1ce885efcff24))
- **settings:** redesign the settings screen ([fab1cac](https://github.com/thekrishdas/extrack/commit/fab1cacd46fd7a16c1b7e515185aad43630af039))
- **summary:** add ability to select a single timeframe ([7ac10a1](https://github.com/thekrishdas/extrack/commit/7ac10a1eca1ed92be9e1161d26e364640125c826))
- **summary:** add interactive chart component for transaction visualization ([6f98cee](https://github.com/thekrishdas/extrack/commit/6f98cee2961910da4614bcc8a4bfabadd7e3080c))
- **summary:** redesign dashboard with chart visualizations ([30c5278](https://github.com/thekrishdas/extrack/commit/30c52783eea624dc4b0bef7e728ab765524b6e41))
- **theme:** add dark/light/system theme support with next-themes ([781513b](https://github.com/thekrishdas/extrack/commit/781513b057de5f739cd82e41a0697227edd0b72f))
- **transaction-drawer:** adjust spacing, add delete/edit buttons ([8d00cc2](https://github.com/thekrishdas/extrack/commit/8d00cc26e491893580a35d099a2ecfb15d0b51cd))
- **transaction:** add account selection field to new form ([e72e301](https://github.com/thekrishdas/extrack/commit/e72e301ef69e0df84c09c546ef86f2cd62ca683d))
- **transaction:** add optimistic updates and improve validation ([0ce3050](https://github.com/thekrishdas/extrack/commit/0ce3050e79841d4f2bb46a361a9a50028e29ad44))
- **transaction:** add type prop and afterSubmit callback ([e201ae3](https://github.com/thekrishdas/extrack/commit/e201ae35e48b9f06f707923396b01d0f640cb335))
- **transaction:** implement async defaults for new transaction form ([de6ada2](https://github.com/thekrishdas/extrack/commit/de6ada2d767c5c820dddbdcaf4e6a341c28c2626))
- **transaction:** improve validation error messages in new form schema ([a7c51a5](https://github.com/thekrishdas/extrack/commit/a7c51a50d354ab0cf2f6dadf397cf44afed05c4d))
- **transaction:** migrate new transaction form to TanStack Form ([68c8af1](https://github.com/thekrishdas/extrack/commit/68c8af183c32ca58a0e2d202ed0822c361d40e43))
- **transactions:** add historical balance calculation ([0c73773](https://github.com/thekrishdas/extrack/commit/0c737731afdf2872c985403e82fe486ea651e675))
- **transactions:** add timeframe-based summary query ([5529c98](https://github.com/thekrishdas/extrack/commit/5529c98bdac3e4c8a8b4b3c78e739f99157d10ea))
- truncate texts in transaction list items ([1aeaf44](https://github.com/thekrishdas/extrack/commit/1aeaf44855333664046379cf2173e0c64d597500))
- **ui/dock:** refine Dock layout and navigation buttons ([56a6efa](https://github.com/thekrishdas/extrack/commit/56a6efa188ba34ba8be74de436c04e0cca37c4d7))
- **ui/drawer-v3:** add iOS26-inspired Drawer v3 UI ([53ca27b](https://github.com/thekrishdas/extrack/commit/53ca27bd9712a9dddc1c5c0a08d56cb0a1922113))
- **ui/drawer:** add ActionDrawer inspired by iOS26 ([aeba4b6](https://github.com/thekrishdas/extrack/commit/aeba4b65c0207a7d6e3e93f91104fdd4d6f36e38))
- **ui/drawer:** add new iOS-style Drawer v2 ([dce9c68](https://github.com/thekrishdas/extrack/commit/dce9c68d90a312b1bc752a82c8e4903b7f729c69))
- **ui/emoji:** add Emoji component and use in account icon renders ([5529b2b](https://github.com/thekrishdas/extrack/commit/5529b2b7ea75d874513d04650be7f1e0a2cec581))
- **ui/inset-list:** introduce InsetList component and deprecate old list components ([741d360](https://github.com/thekrishdas/extrack/commit/741d360587de9b95d6140cf4f6e041b53119a206))
- **ui/list:** add new version of the list ([0967a89](https://github.com/thekrishdas/extrack/commit/0967a892c08f23d586f3b1e5647ff55adeb6f3b0))
- **ui/separator:** add Separator component ([da310c0](https://github.com/thekrishdas/extrack/commit/da310c0c9337d6553f7f35ad82fc9867378502ec))
- **ui/switch:** add accessible toggle component ([41a487d](https://github.com/thekrishdas/extrack/commit/41a487db9c5c22472c0e61145c4f386257a77f41))
- **ui/transaction:** add new-v2 Form with iOS-style DrawerV2 ([7b80f0b](https://github.com/thekrishdas/extrack/commit/7b80f0bc5017443c3075ab4ef51ff12d0d1d8d29))
- **ui/transaction:** reset form on drawer close & various UI/query enhancements ([d67f106](https://github.com/thekrishdas/extrack/commit/d67f10613d87862891490f4c6c143bdea8bd2568))
- **ui/transaction:** reset form on drawer close & various UI/query enhancements ([99be3a6](https://github.com/thekrishdas/extrack/commit/99be3a6c964e2fd196326ca8c48eea4de5978d6c))
- **ui:** add calendar component with react-aria ([67d1290](https://github.com/thekrishdas/extrack/commit/67d12903ffef46a8e993884996193c627c372176))
- **ui:** add drawer component using Base UI ([5ef4c9e](https://github.com/thekrishdas/extrack/commit/5ef4c9e93335c7b2783633f5951734f1ad9affeb))
- **ui:** add Spinner components & refine ListV2 Accessories ([e3c9426](https://github.com/thekrishdas/extrack/commit/e3c942691a30f5db9300b48c9445edae0944c8f1))
- **ui:** enhance shadows, FAB, and navigation ([2ca9ade](https://github.com/thekrishdas/extrack/commit/2ca9ade41e608c3c3276d279e6866dfbab415a94))
- use ark factory to render the list components ([48caa76](https://github.com/thekrishdas/extrack/commit/48caa76d444e3433661f176bc30c8d72d93a9b99))
- use the data-table to display transaciton details ([950cfd2](https://github.com/thekrishdas/extrack/commit/950cfd2cac401f29979421a0bc4f6edb100e6638))
- use the new custom drawer component ([b18489e](https://github.com/thekrishdas/extrack/commit/b18489ea26727908dd6c5613e25200b0dfba9945))
- use zod to validate the form inputs ([834278c](https://github.com/thekrishdas/extrack/commit/834278c90b979e0f63092bfb4b4d2426a7832822))
- used the new transaction form ([502801f](https://github.com/thekrishdas/extrack/commit/502801fd7b00213e122560b279e4691ef33c9943))
- **user:** add getInitials helper for avatar placeholders ([a30ed96](https://github.com/thekrishdas/extrack/commit/a30ed96f2c369d01608450ed3dceb96bc0a8f76b))
- **vercel:** differentiate production and preview builds ([d21e131](https://github.com/thekrishdas/extrack/commit/d21e1313816e967418ed93e046013ee86184551a))
- **virtualizer:** add window-based virtualizer with infinite support ([8a47f2d](https://github.com/thekrishdas/extrack/commit/8a47f2d2b714636d0f03322f9d370dc9a10a3ca2))

### Bug Fixes

- **accounts:** prevent selecting inactive accounts ([c49d93d](https://github.com/thekrishdas/extrack/commit/c49d93dda7960c8fb27a8f0f28fc49c86ef97d09))
- **activity-drawer:** display amount in dollars instead of cents ([d4504f1](https://github.com/thekrishdas/extrack/commit/d4504f1754de11d318089999fd4351b0b11c366e))
- **activity:** show loader while loading more transactions ([262babe](https://github.com/thekrishdas/extrack/commit/262babe04175b8cf0789212de41072c8b0ddb93b))
- Add background and foreground variable to tailwind theme ([e9c6052](https://github.com/thekrishdas/extrack/commit/e9c60524b712eeb3cd328343a28fc580965f8564))
- add missing packages to `package.json` ([bccde59](https://github.com/thekrishdas/extrack/commit/bccde59ed0da9e08cc8fbc4cb1dfda5f4185c427))
- **calendar:** adjust grid container width ([8b242d4](https://github.com/thekrishdas/extrack/commit/8b242d489a4f416fc5988fe28f67d9a2edd70739))
- **category:** enforce per-type limit and case-insensitive dedupe ([5f1c868](https://github.com/thekrishdas/extrack/commit/5f1c868cfa3a3f3b27b73ba0a6df527f09a4c112))
- **charts:** correct remaining balance calculation ([8f2c7b1](https://github.com/thekrishdas/extrack/commit/8f2c7b1f8dea84c9eb0a549a58196c0f1ef8a0be))
- **charts:** correct remaining balance percentage calculation ([88cf9c7](https://github.com/thekrishdas/extrack/commit/88cf9c702434997bcbe56c8d679e5d397ab29dac))
- **charts:** fix loading spinner showing after data loads ([e732335](https://github.com/thekrishdas/extrack/commit/e732335e06de974e75998df35020c53037b1b849))
- **convex:** rename webhook to http ([0cf7a16](https://github.com/thekrishdas/extrack/commit/0cf7a167ba58e8d450af9264a771ce24d7cb4d70))
- **currency:** limit fraction digits to 2 in formatter ([07b037b](https://github.com/thekrishdas/extrack/commit/07b037bfad7583da5457ab4ef46dc1ca737eb77d))
- **date-utils:** use valid locale code for India ([492281e](https://github.com/thekrishdas/extrack/commit/492281e6e9e63bffe203d62cdc529f791e31baf8))
- explicitly set aria-hidden to true in Spacer ([c8bcc1b](https://github.com/thekrishdas/extrack/commit/c8bcc1ba3975e8d0a659d8b36f5f9fdbd148ee13))
- hydration error in new transaction form ([15ad585](https://github.com/thekrishdas/extrack/commit/15ad5858fbf7c24047e289a9662468ae1c21e201))
- issue where the buttons on the island were not clickable ([68a6e30](https://github.com/thekrishdas/extrack/commit/68a6e3091d37bf8a255943fc91f7fc0137e42cb9))
- make note optional ([c8bd045](https://github.com/thekrishdas/extrack/commit/c8bd0459ba760a428ac864dd3c7a38be75a0ba3c))
- **onboarding:** validate default account exists before creating user ([ccccb61](https://github.com/thekrishdas/extrack/commit/ccccb615fee252a3e4bff956f1c6933732896eab))
- **settings:** trailing info not showing in settings ([b23ad18](https://github.com/thekrishdas/extrack/commit/b23ad1842fd65e642e7060ef7d7139bcbb4a5316))
- **styles:** add dark mode variant ([02d2ac1](https://github.com/thekrishdas/extrack/commit/02d2ac1c5e42a7eedfa14da18f2febd858117088))
- **summary:** correct month-over-month delta calculation ([986c078](https://github.com/thekrishdas/extrack/commit/986c078af1d03348287b540217005b8328623ba4))
- **transactions:** improve amount validation error ([a9cc109](https://github.com/thekrishdas/extrack/commit/a9cc109aa94269881c3b7163b387d738272bcd4b))
- **ui:** prevent inset list text overflow ([f13203d](https://github.com/thekrishdas/extrack/commit/f13203d747db44a3539d4148fd2dd8d9734a845a))
- **ui:** use semantic inset list sections ([4e8575f](https://github.com/thekrishdas/extrack/commit/4e8575f5b4df900d6e22a795047bea51dc58cdb7))
- update favicon ([53774b5](https://github.com/thekrishdas/extrack/commit/53774b515325201fb7528a50227bbfd1341516c9))
- **validation:** tighten whitespace handling ([bacff90](https://github.com/thekrishdas/extrack/commit/bacff904c30f102ca11e48e9bb935f28f68ce9de))

- **convex:** rename reconcileBalance, type db ops ([a17d341](https://github.com/thekrishdas/extrack/commit/a17d34179a73d3c736a42830f026dd8b3b534915))
- **db:** add category table and modify transaction queries ([4ba7134](https://github.com/thekrishdas/extrack/commit/4ba7134e8be68769ac7cadf39d4ff6b302851b55))
