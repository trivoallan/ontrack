## REMOVED Requirements

### Requirement: Sources come from npm dependencies
**Reason**: The term "source" is replaced by "track"; the capability `tracks` takes this requirement over.
**Migration**: See "Tracks come from npm dependencies" in `tracks`. The behaviour is the same.

### Requirement: The npm alias is the local namespace
**Reason**: Moved to the capability `tracks`.
**Migration**: See the requirement of the same name in `tracks`. The behaviour is the same; the error for a scoped alias says "track".

### Requirement: The alias local is reserved
**Reason**: Moved to the capability `tracks`.
**Migration**: See the requirement of the same name in `tracks`. The behaviour is the same.

### Requirement: Source ADR directory
**Reason**: The term "source" is replaced by "track"; the capability `tracks` takes this requirement over.
**Migration**: See "Track ADR directory" in `tracks`. The `adr` string of the `ontrack` key is read as before.

### Requirement: Missing installation is an error
**Reason**: Moved to the capability `tracks`.
**Migration**: See the requirement of the same name in `tracks`. The behaviour is the same.

### Requirement: Published schema for the ontrack key
**Reason**: Moved to the capability `tracks`.
**Migration**: See the requirement of the same name in `tracks`. The schema stays at `schema/ontrack.schema.json` and accepts the same documents; only its title and description change.
