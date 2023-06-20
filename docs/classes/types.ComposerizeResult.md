[composerize-ts](../README.md) / [Modules](../modules.md) / [types](../modules/types.md) / ComposerizeResult

# Class: ComposerizeResult

[types](../modules/types.md).ComposerizeResult

The result of a conversion. The result contains the docker-compose.yml and
additional [Message](../interfaces/types.Message.md)s.

## Table of contents

### Constructors

- [constructor](types.ComposerizeResult.md#constructor)

### Properties

- [messages](types.ComposerizeResult.md#messages)
- [yaml](types.ComposerizeResult.md#yaml)

## Constructors

### constructor

• **new ComposerizeResult**(`yaml`, `messages`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `yaml` | `string` |
| `messages` | [`Message`](../interfaces/types.Message.md)[] |

#### Defined in

[types.ts:8](https://github.com/cgoIT/composerize-ts/blob/e64128b/src/types.ts#L8)

## Properties

### messages

• **messages**: [`Message`](../interfaces/types.Message.md)[]

#### Defined in

[types.ts:13](https://github.com/cgoIT/composerize-ts/blob/e64128b/src/types.ts#L13)

___

### yaml

• **yaml**: `string`

#### Defined in

[types.ts:12](https://github.com/cgoIT/composerize-ts/blob/e64128b/src/types.ts#L12)
