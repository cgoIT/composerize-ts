[composerize-ts](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### Functions

- [composerize](index.md#composerize)
- [listSupportedOptions](index.md#listsupportedoptions)

## Functions

### composerize

▸ **composerize**(`command`, `composeVersion?`, `debug?`): [`ComposerizeResult`](../classes/types.ComposerizeResult.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `command` | `string` | `undefined` |
| `composeVersion` | `number` | `3.9` |
| `debug` | `boolean` | `false` |

#### Returns

[`ComposerizeResult`](../classes/types.ComposerizeResult.md)

#### Defined in

[composerize.ts:36](https://github.com/cgoIT/composerize-ts/blob/ac4f325/src/composerize.ts#L36)

___

### listSupportedOptions

▸ **listSupportedOptions**(): [`SupportedOption`](../classes/types.SupportedOption.md)[]

Function to return all the supported (=currently implemented) options with their corresponding docker-compose equivalent.

#### Returns

[`SupportedOption`](../classes/types.SupportedOption.md)[]

#### Defined in

[composerize.ts:55](https://github.com/cgoIT/composerize-ts/blob/ac4f325/src/composerize.ts#L55)
