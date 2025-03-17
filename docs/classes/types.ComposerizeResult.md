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

• **new ComposerizeResult**(`yaml`, `messages`): [`ComposerizeResult`](types.ComposerizeResult.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `yaml` | `string` |
| `messages` | [`Message`](../interfaces/types.Message.md)[] |

#### Returns

[`ComposerizeResult`](types.ComposerizeResult.md)

#### Defined in

[types.ts:10](https://github.com/cgoIT/composerize-ts/blob/d780d65089122253e4e9aa66d7ebd2607f697612/src/types.ts#L10)

## Properties

### messages

• **messages**: [`Message`](../interfaces/types.Message.md)[]

#### Defined in

[types.ts:16](https://github.com/cgoIT/composerize-ts/blob/d780d65089122253e4e9aa66d7ebd2607f697612/src/types.ts#L16)

___

### yaml

• **yaml**: `string`

#### Defined in

[types.ts:15](https://github.com/cgoIT/composerize-ts/blob/d780d65089122253e4e9aa66d7ebd2607f697612/src/types.ts#L15)
