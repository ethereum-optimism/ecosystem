'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@eth-optimism/ui-components/src/components/ui/accordian/accordion'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

const accordionItems = [
  {
    question: 'What is a testnet faucet?',
    answer: (
      <Text as="p">
        A testnet faucet is a way for developers to receive free tokens that can
        be used to interact with smart contracts on test networks, or testnets,
        like OP Sepolia.
      </Text>
    ),
  },
  {
    question: 'How does the Superchain faucet work?',
    answer: (
      <Text as="p">
        A testnet faucet is a way for blockchain developers to get free testnet
        tokens that can be used to build and interact with smart contracts on
        test networks, or testnets in the Superchain like Base Sepolia. To
        access these tokens, developers can authenticate using their onchain
        identity or GitHub account.,
      </Text>
    ),
  },
  {
    question: 'What is onchain identity?',
    answer: (
      <div className="flex flex-col gap-4">
        <Text as="p">
          Traditionally, most faucets require social authentication and
          significantly limit the amount of testnet funds that can be obtained
          per week to prevent sybil-attacks. In comparison, in addition to the
          social authentication route, the Superchain faucet allows developers
          to authenticate via their onchain identity. Developers that choose to
          authenticate via their onchain identity can claim 20 times more
          testnet ETH versus traditional faucets.
        </Text>
        <Text as="p">
          Superchain faucet currently supports four kinds of onchain identity:
        </Text>
        <Text as="p">
          <b>Coinbase Verification</b> leverages the Ethereum Attestation
          Service to enable the issuance of Coinbase-verified, onchain
          attestations.
        </Text>
        <Text as="p">
          <b>World ID</b>, from Worldcoin, is a digital passport that lets you
          prove you are a unique and real person while remaining anonymous.
        </Text>
        <Text as="p">
          <b>Gitcoin Passport</b> is an identity verification application. It
          helps you collect “stamps” that prove your humanity and reputation. Please note, 
          the faucet requires a passport score > 25.
        </Text>
        <Text as="p">
          An <b>Ethereum attestation</b> is a digital record that is
          cryptographically signed by an individual, company, or group to verify
          the identity, credentials, or other information about an individual,
          organization, or entity.
        </Text>
      </div>
    ),
  },
  {
    question: 'What if I run into an issue or have questions?',
    answer: (
      <Text as="p">
        If you encounter any issues or have questions, we encourage you to join
        our Discord community and head over to the #dev-help channel.
        Contributors to the Optimism Collective will be there to assist you and
        address any concerns you may have.
      </Text>
    ),
  },
  {
    question: 'How do I donate?',
    answer: (
      <Text as="p">
        Donate your extra testnet ETH to help other developers for the supported
        OP Chains at 0x18e75dAbeD7aea55DA355ACB6165F38fd9FC6111
      </Text>
    ),
  },
  {
    question: 'What is the Superchain?',
    answer: (
      <Text as="p">
        Superchain is a set of chains that all share a software stack and have
        the same security properties that enable them to communicate and work
        together. Learn more about the Superchain.
      </Text>
    ),
  },
  {
    question: 'How do I start building on the Superchain?',
    answer: (
      <Text as="p">
        If you're new to onchain development check out Optimism Unleashed by
        CryptoZombies and Superchain Builder NFT by ThirdWeb. If you're familiar
        with onchain development, check out the Optimism Ecosystem’s
        Contributions Dashboard for project ideas that the Optimism Collective
        is looking for.
      </Text>
    ),
  },
]
const Faqs = () => {
  return (
    <div className="w-full max-w-screen-lg">
      <Text as="h1" className="text-2xl font-semibold mb-4 text-center ">
        FAQs
      </Text>
      <Accordion type="single" collapsible>
        {accordionItems.map((item, index) => (
          <AccordionItem key={index} value={item.question}>
            <AccordionTrigger>
              <Text as="span" className="text-left">
                {item.question}
              </Text>
            </AccordionTrigger>
            <AccordionContent className="text-secondary-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export { Faqs }
