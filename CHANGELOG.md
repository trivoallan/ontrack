# Changelog

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
