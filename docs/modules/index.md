[composerize-ts](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### References

- [ComposerizeResult](index.md#composerizeresult)
- [Message](index.md#message)
- [MessageType](index.md#messagetype)
- [SupportedOption](index.md#supportedoption)

### Functions

- [composerize](index.md#composerize)
- [listSupportedOptions](index.md#listsupportedoptions)

## References

### ComposerizeResult

Re-exports [ComposerizeResult](../classes/types.ComposerizeResult.md)

___

### Message

Re-exports [Message](../interfaces/types.Message.md)

___

### MessageType

Re-exports [MessageType](../enums/types.MessageType.md)

___

### SupportedOption

Re-exports [SupportedOption](../classes/types.SupportedOption.md)

## Functions

### composerize

▸ **composerize**(`command`, `composeVersion?`, `debug?`, `includeVersion?`): [`ComposerizeResult`](../classes/types.ComposerizeResult.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `command` | `string` | `undefined` |
| `composeVersion` | `number` | `3.9` |
| `debug` | `boolean` | `false` |
| `includeVersion` | `boolean` | `false` |

#### Returns

[`ComposerizeResult`](../classes/types.ComposerizeResult.md)

#### Defined in

[composerize.ts:36](https://github.com/cgoIT/composerize-ts/blob/b18cfd805347519f36fb4f64732e3f73cd5a52c1/src/composerize.ts#L36)

___

### listSupportedOptions

▸ **listSupportedOptions**(): [`SupportedOption`](../classes/types.SupportedOption.md)[]

Function to return all the supported (=currently implemented) options with their corresponding docker-compose equivalent.

#### Returns

[`SupportedOption`](../classes/types.SupportedOption.md)[]

#### Defined in

[composerize.ts:63](https://github.com/cgoIT/composerize-ts/blob/b18cfd805347519f36fb4f64732e3f73cd5a52c1/src/composerize.ts#L63)
