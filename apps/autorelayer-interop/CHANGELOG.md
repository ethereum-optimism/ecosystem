# @eth-optimism/autorelayer-interop

## 0.0.25

### Patch Changes

- Updated dependencies [[`0d137a4`](https://github.com/ethereum-optimism/ecosystem/commit/0d137a4bad2982ea2a33ef5dcc7f1baeef0de1f7)]:
  - @eth-optimism/viem@0.4.14

## 0.0.24

### Patch Changes

- [#902](https://github.com/ethereum-optimism/ecosystem/pull/902) [`1023356`](https://github.com/ethereum-optimism/ecosystem/commit/10233560e76a003753790aac96e8a467b0f7bba8) Thanks [@tremarkley](https://github.com/tremarkley)! - Fix BigInt serialization on ponder api and fix GasProvider concurrency bug

## 0.0.23

### Patch Changes

- [#900](https://github.com/ethereum-optimism/ecosystem/pull/900) [`bfbe209`](https://github.com/ethereum-optimism/ecosystem/commit/bfbe209aff7eede190d07c99586d94217a8929c2) Thanks [@tremarkley](https://github.com/tremarkley)! - Add support for sponsoring relays for specific message targets

## 0.0.22

### Patch Changes

- [#887](https://github.com/ethereum-optimism/ecosystem/pull/887) [`9327346`](https://github.com/ethereum-optimism/ecosystem/commit/9327346fe9eca31f1d8e350f920714fd9723795f) Thanks [@tremarkley](https://github.com/tremarkley)! - incorporate pending claims into GasProvider balance calculations

## 0.0.21

### Patch Changes

- [#889](https://github.com/ethereum-optimism/ecosystem/pull/889) [`2f85631`](https://github.com/ethereum-optimism/ecosystem/commit/2f856315b9e59b92b9eebda5904a29a9da11da0f) Thanks [@tremarkley](https://github.com/tremarkley)! - Update relays through the GasTank to specify GasProvider when relaying message

- Updated dependencies [[`2f85631`](https://github.com/ethereum-optimism/ecosystem/commit/2f856315b9e59b92b9eebda5904a29a9da11da0f)]:
  - @eth-optimism/viem@0.4.13

## 0.0.20

### Patch Changes

- [#870](https://github.com/ethereum-optimism/ecosystem/pull/870) [`b884495`](https://github.com/ethereum-optimism/ecosystem/commit/b884495be17c4f96d8cafae3368c1688f06d6f11) Thanks [@tremarkley](https://github.com/tremarkley)! - Updates the relayer to fetch and claim funds for all unclaimed relayed messages from the GasTank on each loop interval

- [#883](https://github.com/ethereum-optimism/ecosystem/pull/883) [`9dcabbc`](https://github.com/ethereum-optimism/ecosystem/commit/9dcabbc2739afd4ea23c7c766876d3e93727f813) Thanks [@tremarkley](https://github.com/tremarkley)! - deduct pending withdrawals from gas tank provider balance

## 0.0.19

### Patch Changes

- [#861](https://github.com/ethereum-optimism/ecosystem/pull/861) [`177a682`](https://github.com/ethereum-optimism/ecosystem/commit/177a682c8f6262221c166c2bd51861ff5914db4a) Thanks [@tremarkley](https://github.com/tremarkley)! - Only relay pending messages with gas tank funds when gasTankAddress option is set

## 0.0.18

### Patch Changes

- Updated dependencies [[`e489b1a`](https://github.com/ethereum-optimism/ecosystem/commit/e489b1a1add3351c517769d82b7fa7542a16e7b8)]:
  - @eth-optimism/viem@0.4.12

## 0.0.17

### Patch Changes

- Updated dependencies [[`187601c`](https://github.com/ethereum-optimism/ecosystem/commit/187601c7d870f4f6a62b9338b58d36099d14ccec)]:
  - @eth-optimism/viem@0.4.11

## 0.0.16

### Patch Changes

- [#846](https://github.com/ethereum-optimism/ecosystem/pull/846) [`6ee7f14`](https://github.com/ethereum-optimism/ecosystem/commit/6ee7f14a3c95ccfc26687fdcf33fb2cc025bfa5a) Thanks [@tremarkley](https://github.com/tremarkley)! - add GAS_TANK_ADDRESS option for enabling relays via GasTank

## 0.0.15

### Patch Changes

- Updated dependencies [[`5df7d6d`](https://github.com/ethereum-optimism/ecosystem/commit/5df7d6d5da8f5a374ebb53a63692cdb4eee563b5)]:
  - @eth-optimism/viem@0.4.10

## 0.0.14

### Patch Changes

- Updated dependencies [[`1ef3b6b`](https://github.com/ethereum-optimism/ecosystem/commit/1ef3b6b777619ec85a5f6848f8eca8491279268e)]:
  - @eth-optimism/utils-app@0.0.6

## 0.0.13

### Patch Changes

- Updated dependencies [[`1e7472f`](https://github.com/ethereum-optimism/ecosystem/commit/1e7472f0582288583b5e6807892025f12172092a), [`40a535f`](https://github.com/ethereum-optimism/ecosystem/commit/40a535fb51f751cf0db265b4c26fb2f1badf6f46)]:
  - @eth-optimism/viem@0.4.9
  - @eth-optimism/utils-app@0.0.5

## 0.0.12

### Patch Changes

- [#814](https://github.com/ethereum-optimism/ecosystem/pull/814) [`0f1dadb`](https://github.com/ethereum-optimism/ecosystem/commit/0f1dadb349cff4576f6a88881be8a2fe29df271c) Thanks [@tremarkley](https://github.com/tremarkley)! - make logger protected

## 0.0.11

### Patch Changes

- [#798](https://github.com/ethereum-optimism/ecosystem/pull/798) [`ebbbe50`](https://github.com/ethereum-optimism/ecosystem/commit/ebbbe50d8e014b7507afa0b8d8102a06ce5024d3) Thanks [@tremarkley](https://github.com/tremarkley)! - make fetchPendingMessages overridable

## 0.0.10

### Patch Changes

- Updated dependencies [[`03b307c`](https://github.com/ethereum-optimism/ecosystem/commit/03b307c9744beb834746182f402bc8f1705c8ea4)]:
  - @eth-optimism/utils-app@0.0.4

## 0.0.9

### Patch Changes

- [#788](https://github.com/ethereum-optimism/ecosystem/pull/788) [`6241bfa`](https://github.com/ethereum-optimism/ecosystem/commit/6241bfab30a3e297b67b8249e2937ffeba48535e) Thanks [@tremarkley](https://github.com/tremarkley)! - add tx origin to indexed sent messages

## 0.0.8

### Patch Changes

- [#786](https://github.com/ethereum-optimism/ecosystem/pull/786) [`ad65e1d`](https://github.com/ethereum-optimism/ecosystem/commit/ad65e1d44415099871f7dd1d4886f92bcc8fe0ce) Thanks [@tremarkley](https://github.com/tremarkley)! - export RelayerConfig type

## 0.0.7

### Patch Changes

- [#784](https://github.com/ethereum-optimism/ecosystem/pull/784) [`da3016d`](https://github.com/ethereum-optimism/ecosystem/commit/da3016d639fd95304ab81363c2c9db96bf7d046b) Thanks [@tremarkley](https://github.com/tremarkley)! - Add pending message validation hooks to Relayer

## 0.0.6

### Patch Changes

- [#781](https://github.com/ethereum-optimism/ecosystem/pull/781) [`1cc1e82`](https://github.com/ethereum-optimism/ecosystem/commit/1cc1e82488fa1d8e3eb2f6a8e950186a07cce457) Thanks [@tremarkley](https://github.com/tremarkley)! - add chain endpoint override option to RelayerApp

## 0.0.5

### Patch Changes

- Updated dependencies [[`c9dbca4`](https://github.com/ethereum-optimism/ecosystem/commit/c9dbca401eed763eb20b05437e3e460cdaadd711)]:
  - @eth-optimism/viem@0.4.8

## 0.0.4

### Patch Changes

- [#777](https://github.com/ethereum-optimism/ecosystem/pull/777) [`d216930`](https://github.com/ethereum-optimism/ecosystem/commit/d216930f1d1cd72144a4da7d199c30c06bde3abb) Thanks [@tremarkley](https://github.com/tremarkley)! - Allow specifying sponsored endpoint and sender key by env

## 0.0.3

### Patch Changes

- [#770](https://github.com/ethereum-optimism/ecosystem/pull/770) [`4a7f3be`](https://github.com/ethereum-optimism/ecosystem/commit/4a7f3be47fd7ebef846341c499588bdcb2a00773) Thanks [@tremarkley](https://github.com/tremarkley)! - initialize autorelayer-interop package

- Updated dependencies [[`4a7f3be`](https://github.com/ethereum-optimism/ecosystem/commit/4a7f3be47fd7ebef846341c499588bdcb2a00773)]:
  - @eth-optimism/utils-app@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [[`8b58cc7`](https://github.com/ethereum-optimism/ecosystem/commit/8b58cc7e852d066561f1e680fca5d29a2dd318b1)]:
  - @eth-optimism/utils-app@0.0.2
