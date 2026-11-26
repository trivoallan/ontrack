# Changelog

## [0.7.0](https://github.com/trivoallan/ontrack/compare/v0.6.0...v0.7.0) (2026-11-26)


### Features

* **cli:** add ontrack decide, to record a new decision with the user ([#245](https://github.com/trivoallan/ontrack/issues/245)) ([92d806c](https://github.com/trivoallan/ontrack/commit/92d806cf81ba1947bffb11ac4ac4ffc6894f8d07))
* **cli:** add ontrack suggest, an audit of the decisions never recorded ([#243](https://github.com/trivoallan/ontrack/issues/243)) ([278f26a](https://github.com/trivoallan/ontrack/commit/278f26a922292d95201f1b3b355d14a5c92789f4))
* **plan:** report supersedes entries that designate no ADR ([#241](https://github.com/trivoallan/ontrack/issues/241)) ([f3ec014](https://github.com/trivoallan/ontrack/commit/f3ec014fddc937ee9d870258441a0ae01df88aab))


### Bug Fixes

* **governance:** make local/ADR-0027 supersede ADR-0022 ([#240](https://github.com/trivoallan/ontrack/issues/240)) ([a03568b](https://github.com/trivoallan/ontrack/commit/a03568b50e6e20932ee3806f846d8562bb01a269))

## [0.6.0](https://github.com/trivoallan/ontrack/compare/v0.5.0...v0.6.0) (2026-11-16)


### ⚠ BREAKING CHANGES

* the block of AGENTS.md opens with "## Project instructions (ontrack)"; plan and apply print "AGENTS.md: instructions block ..."; check prints "adr: <path>" after a fail line; the prompts of review say "convention". Run "ontrack apply" once to rewrite the block.
* **cli:** an error line starts with `ontrack[E<nnn>]:` where it started with `ontrack:`. The message after the colon and the exit code `1` are unchanged.

### Features

* **apply:** rename a track's namespace without losing its rulings ([#208](https://github.com/trivoallan/ontrack/issues/208)) ([2139a3f](https://github.com/trivoallan/ontrack/commit/2139a3fd63b1f14d8af7b94738ecdcf651b97df9))
* call what a track ships a convention ([#221](https://github.com/trivoallan/ontrack/issues/221)) ([13157a5](https://github.com/trivoallan/ontrack/commit/13157a548abb3136d2d26e0a4913a9a4e2e04c7b))
* **cli:** give every error a stable code ([#214](https://github.com/trivoallan/ontrack/issues/214)) ([08d20c5](https://github.com/trivoallan/ontrack/commit/08d20c5332655a1ab4cb2363348397f5c88da47d))
* **cli:** print what every command reports, and every error, as JSON ([#219](https://github.com/trivoallan/ontrack/issues/219)) ([071ce2e](https://github.com/trivoallan/ontrack/commit/071ce2e2de0751dddfa8a117976f2527f2de83dc))
* **cli:** publish a JSON Schema for each document of --json ([#217](https://github.com/trivoallan/ontrack/issues/217)) ([0e1228c](https://github.com/trivoallan/ontrack/commit/0e1228c32811f5c13ddd87b96a58df6c79ea3c55))
* **cli:** start each document of --json with the address of its schema ([#218](https://github.com/trivoallan/ontrack/issues/218)) ([e1e17c0](https://github.com/trivoallan/ontrack/commit/e1e17c00a08b707c46aff7580a5ac19831a914ea))
* **review:** rule from the repository's practice, and mark each value observed or absent ([#205](https://github.com/trivoallan/ontrack/issues/205)) ([0b5565e](https://github.com/trivoallan/ontrack/commit/0b5565e2d83c0c7eb49c3a32c57ab83b8f8c6543))
* **review:** rule what the history answers first, and stop when you choose ([#210](https://github.com/trivoallan/ontrack/issues/210)) ([dd26cb9](https://github.com/trivoallan/ontrack/commit/dd26cb9117d5f69c3f8ba25dd3de12070887b1c3))


### Bug Fixes

* **cli:** name the cause or the next step in four dead-end messages ([#211](https://github.com/trivoallan/ontrack/issues/211)) ([ea5821f](https://github.com/trivoallan/ontrack/commit/ea5821f17c35925b1211e7b64d3013eba3f6edeb))
* **review:** say what review prints in one short help line ([#213](https://github.com/trivoallan/ontrack/issues/213)) ([f9e6936](https://github.com/trivoallan/ontrack/commit/f9e69360cd8ca3051fad7cbb78a2131cc04fbee0))

## [0.5.0](https://github.com/trivoallan/ontrack/compare/v0.4.0...v0.5.0) (2026-11-15)


### ⚠ BREAKING CHANGES

* **tracks:** `ontrack plan` prints `no track found` where it printed `no ontrack source found`; discovery errors say `track "<alias>"` where they said `source "<alias>"`; the npm keyword of a published package is `ontrack-tracks`, no longer `ontrack-source`. Exit codes and file formats are unchanged.
* own ADRs directly in docs/adr/ make `ontrack plan` exit with 2 until `ontrack apply` has moved them to docs/adr/local/. A source can no longer be installed under the alias `local`. The propose workflow refuses a new ADR placed directly in docs/adr/.

### Features

* **instructions:** point agents at `ontrack review` in the rules block ([#185](https://github.com/trivoallan/ontrack/issues/185)) ([f982ce0](https://github.com/trivoallan/ontrack/commit/f982ce04888457662fa4cc58c18bdd6bc632cfcf))
* let other repositories call the propose and apply workflows ([#156](https://github.com/trivoallan/ontrack/issues/156)) ([e2144ac](https://github.com/trivoallan/ontrack/commit/e2144ac9aaa6c4fa13e24852e025ccee9c179518))
* move a repository's own ADRs to docs/adr/local ([#165](https://github.com/trivoallan/ontrack/issues/165)) ([ef7a712](https://github.com/trivoallan/ontrack/commit/ef7a712178ec68f6f1c02db95e120439875a012c))
* **review:** import the new ADRs before ruling them ([#175](https://github.com/trivoallan/ontrack/issues/175)) ([43e6bbf](https://github.com/trivoallan/ontrack/commit/43e6bbf3b54c6cd9e87c0bafc1a918e3c9a6105b))
* **review:** title tracking items by bracketed ADR reference ([#169](https://github.com/trivoallan/ontrack/issues/169)) ([a194d20](https://github.com/trivoallan/ontrack/commit/a194d20e1f5417e1ac7fba61278fdfc4ab37494d))
* **tracks:** call a package of questions a track ([#168](https://github.com/trivoallan/ontrack/issues/168)) ([f20966c](https://github.com/trivoallan/ontrack/commit/f20966c4fbf81737fff6be52097bbf45b2867ae8))
* verify-release-provenance ([#134](https://github.com/trivoallan/ontrack/issues/134)) ([1778e73](https://github.com/trivoallan/ontrack/commit/1778e73513df929c19ee0d6e0d051e6f4a71d0d4))


### Bug Fixes

* **apply:** start one apply session per head commit ([#160](https://github.com/trivoallan/ontrack/issues/160)) ([4eb88cf](https://github.com/trivoallan/ontrack/commit/4eb88cffc8dcecbb80854b4329f51b9679ee9e24))
* **cli:** name the package in printed commands when ontrack is not installed ([#202](https://github.com/trivoallan/ontrack/issues/202)) ([73d7272](https://github.com/trivoallan/ontrack/commit/73d7272044ca9e6af7b66d84f4e52aed2b5a5118))
* give the apply sessions the secret guard the checks expect ([#142](https://github.com/trivoallan/ontrack/issues/142)) ([00d3a7e](https://github.com/trivoallan/ontrack/commit/00d3a7eb5beaf58b870d0995a06f722a97df5e8c))
* keep the apply session silent on the pull request's draft state ([#141](https://github.com/trivoallan/ontrack/issues/141)) ([80690b7](https://github.com/trivoallan/ontrack/commit/80690b7f5aefba6e6220d166bafe49453636b941))
* **review:** give the supersedes reference ontrack resolves ([#191](https://github.com/trivoallan/ontrack/issues/191)) ([8c125e8](https://github.com/trivoallan/ontrack/commit/8c125e87646da9b0005db88f7aafe9decbe45cb3))
* **tracks:** say where to run from when there is no package.json ([#177](https://github.com/trivoallan/ontrack/issues/177)) ([66b9caf](https://github.com/trivoallan/ontrack/commit/66b9caf4a81deb5d33799f0659aee104cd403b81))

## [0.4.0](https://github.com/trivoallan/ontrack/compare/v0.3.0...v0.4.0) (2026-11-14)


### Features

* **apply:** name the next step on stderr while ADRs are proposed ([#79](https://github.com/trivoallan/ontrack/issues/79)) ([17ad58d](https://github.com/trivoallan/ontrack/commit/17ad58d902974f07732ca93f76875db6cde3f048))
* draft a change for every labelled issue ([#129](https://github.com/trivoallan/ontrack/issues/129)) ([6051ccd](https://github.com/trivoallan/ontrack/commit/6051ccdc63523e975c51784f67cbc35b41c77a2d))
* gate the apply of a change behind an approved pull request ([#136](https://github.com/trivoallan/ontrack/issues/136)) ([5450a62](https://github.com/trivoallan/ontrack/commit/5450a6202fd0ea2f8bc30a889e3bb8fcd237e1ac))
* **plan:** list every ADR with its verdict under --all ([#113](https://github.com/trivoallan/ontrack/issues/113)) ([4255764](https://github.com/trivoallan/ontrack/commit/42557646594bca51cde05bbb2c381805fd3f1d1f))
* **review:** label tracking items ontrack and skip rulings already tracked ([#101](https://github.com/trivoallan/ontrack/issues/101)) ([2e7a459](https://github.com/trivoallan/ontrack/commit/2e7a45990eb1b7dbd89748626ef1d09935cddb3f))
* **review:** rule again the ADRs whose source revised the question ([#82](https://github.com/trivoallan/ontrack/issues/82)) ([fe52ff1](https://github.com/trivoallan/ontrack/commit/fe52ff100cf5d732bc5ecba7a5002f224efdd6b0))
* tell the pull request where its apply session is and why it stopped ([#137](https://github.com/trivoallan/ontrack/issues/137)) ([b22219b](https://github.com/trivoallan/ontrack/commit/b22219b8581cbcd0cdb44c31c7cf50c943707aaf))


### Bug Fixes

* draft a proposal for an open issue only ([#123](https://github.com/trivoallan/ontrack/issues/123)) ([a2b1cb3](https://github.com/trivoallan/ontrack/commit/a2b1cb33a0db739a529e9b803de9933d92f2304c))
* find the apply session's address in the answer that starts it ([#138](https://github.com/trivoallan/ontrack/issues/138)) ([ef75999](https://github.com/trivoallan/ontrack/commit/ef75999f897e7e8ca93f36a7461bafe8606004f3))
* give the propose workflow its workspace ([#122](https://github.com/trivoallan/ontrack/issues/122)) ([4c7b75c](https://github.com/trivoallan/ontrack/commit/4c7b75cbf35135da14c7bb9a0c3e66cfd6304d5e))
* let the proposal agent run its commands ([#125](https://github.com/trivoallan/ontrack/issues/125)) ([4a3b803](https://github.com/trivoallan/ontrack/commit/4a3b803e0a1504d1f408ac88e57eb840a9dcac56))
* let the proposal agent write the change ([#133](https://github.com/trivoallan/ontrack/issues/133)) ([b1769f7](https://github.com/trivoallan/ontrack/commit/b1769f7d49780f59d7a19d91c099ba3db01e8ab7))
* put the framework's command within the proposal agent's reach ([#135](https://github.com/trivoallan/ontrack/issues/135)) ([268e41b](https://github.com/trivoallan/ontrack/commit/268e41bd850f60c77f1360cef6d4a7eb62d01a40))
* show what stopped the proposal agent ([#132](https://github.com/trivoallan/ontrack/issues/132)) ([e7b33fc](https://github.com/trivoallan/ontrack/commit/e7b33fc8f4472f87742e2b1654e81cc3ef498dda))
* show why the proposal agent fails on its first turn ([#124](https://github.com/trivoallan/ontrack/issues/124)) ([0b8b87b](https://github.com/trivoallan/ontrack/commit/0b8b87b9e9788d3855feb5b6f8a177bd9f302730))

## [0.3.0](https://github.com/trivoallan/ontrack/compare/v0.2.0...v0.3.0) (2026-11-14)


### Features

* **check:** pass the ADR path to check commands as ONTRACK_ADR ([#73](https://github.com/trivoallan/ontrack/issues/73)) ([8d426b6](https://github.com/trivoallan/ontrack/commit/8d426b6fb2f686688a1de18d6c45ed0cdb16212d))
* **check:** report a command that exits with 78 as unchecked ([#72](https://github.com/trivoallan/ontrack/issues/72)) ([7eb5a16](https://github.com/trivoallan/ontrack/commit/7eb5a1643b3d97d4ef0c644ec9bb9e69ada026f0))
* publish to the npm registry as @trivoallan/ontrack ([#88](https://github.com/trivoallan/ontrack/issues/88)) ([edf1c28](https://github.com/trivoallan/ontrack/commit/edf1c28742fbb3d7a02e15b7c2792fb85d9f7a36))

## [0.2.0](https://github.com/trivoallan/ontrack/compare/v0.1.0...v0.2.0) (2026-11-14)


### ⚠ BREAKING CHANGES

* Node 22.18 or later is required (was 20.19).
* **plan:** drop the title when the ADR name carries a slug ([#21](https://github.com/trivoallan/ontrack/issues/21))
* **plan:** `revised` lines read `<name>  <title> (revision a → b)` instead of `<name>  revision a → b`.

### Features

* **apply:** implement ontrack apply ([#14](https://github.com/trivoallan/ontrack/issues/14)) ([3593a3f](https://github.com/trivoallan/ontrack/commit/3593a3fb0e4c5568fc3dc0d21a215fbf27e3236a))
* **apply:** keep the AGENTS.md rules block up to date ([#18](https://github.com/trivoallan/ontrack/issues/18)) ([204873c](https://github.com/trivoallan/ontrack/commit/204873ce135e60e8764e567bd1c57e5d9149395f))
* **apply:** keep the check line of imported ADRs in step with the source ([#57](https://github.com/trivoallan/ontrack/issues/57)) ([c4823f8](https://github.com/trivoallan/ontrack/commit/c4823f86169cc3fba06d4961eb564634dd9b54b5))
* **check:** run the check command of each decided ADR ([#41](https://github.com/trivoallan/ontrack/issues/41)) ([961e8de](https://github.com/trivoallan/ontrack/commit/961e8de3e762812a695fa41c3ffc35117c764cc4))
* **cli:** CLI skeleton and ontrack plan output contract ([#5](https://github.com/trivoallan/ontrack/issues/5)) ([2f435dd](https://github.com/trivoallan/ontrack/commit/2f435dd5c496e08f06747040874650562c2823b9))
* govern ontrack with trivoallan/governance ([#12](https://github.com/trivoallan/ontrack/issues/12)) ([5a3a0f9](https://github.com/trivoallan/ontrack/commit/5a3a0f9724007a6227373198e7dac9345a6f6b29))
* **instructions:** print decided ADR traits as a block for AGENTS.md ([#17](https://github.com/trivoallan/ontrack/issues/17)) ([0f4b385](https://github.com/trivoallan/ontrack/commit/0f4b385286868ad3a143485674fc365fe928bc71))
* migrate the code to TypeScript ([#46](https://github.com/trivoallan/ontrack/issues/46)) ([faed0e5](https://github.com/trivoallan/ontrack/commit/faed0e59a5704190c47b9c93d4a754af8c4deacd)), closes [#30](https://github.com/trivoallan/ontrack/issues/30)
* **plan:** drop the title when the ADR name carries a slug ([#21](https://github.com/trivoallan/ontrack/issues/21)) ([c7b3145](https://github.com/trivoallan/ontrack/commit/c7b31456052c5dad3de7fd12f480469da3e2de3b))
* **plan:** implement ontrack plan ([#8](https://github.com/trivoallan/ontrack/issues/8)) ([d13401f](https://github.com/trivoallan/ontrack/commit/d13401fb9bf1d9510117c89b5c56fc7d4b32e4b1)), closes [#4](https://github.com/trivoallan/ontrack/issues/4)
* **plan:** show each ADR's title ([#13](https://github.com/trivoallan/ontrack/issues/13)) ([5a195b8](https://github.com/trivoallan/ontrack/commit/5a195b843b9577b0b6c038539248d7808b51229e))
* **review:** print a prompt asking an agent to rule the proposed ADRs ([#22](https://github.com/trivoallan/ontrack/issues/22)) ([2d9372e](https://github.com/trivoallan/ontrack/commit/2d9372ea445f04726e9646281f21bc20f5ffbfa0))
* **review:** print a supersession prompt for a named accepted ADR ([#49](https://github.com/trivoallan/ontrack/issues/49)) ([9c96d2b](https://github.com/trivoallan/ontrack/commit/9c96d2b627c7690d5e624ca56dd4ebf1968bcc9c))
* **review:** propose tracking items for rulings the repository does not follow yet ([#29](https://github.com/trivoallan/ontrack/issues/29)) ([ce3e6f3](https://github.com/trivoallan/ontrack/commit/ce3e6f37d8321fe1d09180b965b5c0b0eb0d7bfb))
* **revision:** read an ADR's revision and classify it against upstream ([#6](https://github.com/trivoallan/ontrack/issues/6)) ([10bff07](https://github.com/trivoallan/ontrack/commit/10bff0770d37fa97c57445e8e60513ee2a1fdef4))
* **sources:** discover ontrack sources from npm dependencies ([#7](https://github.com/trivoallan/ontrack/issues/7)) ([6b3c06d](https://github.com/trivoallan/ontrack/commit/6b3c06d3e40d90379cd7f4df7a0590f3061d4eb4))
* **sources:** publish a JSON Schema for a source's ontrack key ([#54](https://github.com/trivoallan/ontrack/issues/54)) ([3b5fbc1](https://github.com/trivoallan/ontrack/commit/3b5fbc140bc27f2f671353bb8fc02d2f74254467))
* **sources:** validate input boundaries with zod ([#53](https://github.com/trivoallan/ontrack/issues/53)) ([877e62e](https://github.com/trivoallan/ontrack/commit/877e62e9d7e2d543c56779fe0fb6731a96448f81))


### Bug Fixes

* **cli:** do not run a subcommand when an option is unknown ([#23](https://github.com/trivoallan/ontrack/issues/23)) ([0635564](https://github.com/trivoallan/ontrack/commit/063556427ff51f319d11a7bdc3a8f4274521b691))
* **instructions:** compare trait keys by path, not by top-level key ([#27](https://github.com/trivoallan/ontrack/issues/27)) ([e5e0978](https://github.com/trivoallan/ontrack/commit/e5e09787a61993ebeb9ac4b7732a2733dc50166c))
