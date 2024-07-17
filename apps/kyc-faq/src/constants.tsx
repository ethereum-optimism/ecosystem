export const SUPPORT_URL = 'https://support.kyc-chain.com'

const kycFormLink = (
  <a
    href="https://kyc.optimism.io/form"
    target="_blank"
    className="underline font-semibold"
  >
    kyc.optimism.io/form
  </a>
)

export const FAQS = [
  {
    question: 'Why am I being asked to complete KYC with Optimism?',
    answer: (
      <p>
        Everyone who receives grants from the Optimism Foundation and some
        business collaborators must complete KYC (or KYB, for businesses).
      </p>
    ),
  },
  {
    question: 'We don’t have a legal entity. How can we complete KYC?',
    answer: (
      <p>
        Individuals and DAOs without a legal wrapper can still complete KYC.
        Please go to {kycFormLink} and start the process to identify who on your
        team must complete KYC.
      </p>
    ),
  },
  {
    question: 'I am part of a DAO. Can I complete KYC for the project?',
    answer: (
      <div>
        <p>
          Everyone who has control over the grant needs to KYC. This includes
          individuals and businesses who may participate in your DAO.
        </p>
        <p>
          Please to go to {kycFormLink} and start the process to identify who on
          your team must complete KYC.
        </p>
      </div>
    ),
  },
  {
    question: 'We have a multisig wallet. Does everyone have to KYC?',
    answer: (
      <p>
        Yes. Any signer on the wallet where the grant will be sent must complete
        KYC, or KYB if they act in a professional capacity on behalf of a
        business entity.{' '}
      </p>
    ),
  },
  {
    question:
      'We have a Gnosis Safe. Does everyone who can vote on proposals need to KYC?',
    answer: (
      <div>
        <p>
          Yes. Anyone who has control over the grant, even partially, must
          complete KYC/KYB.
        </p>
        <p>
          Gnosis Safes are not recommended for the purposes of your OP grant or
          delegation, but if you intend to use a wallet with multiple signers or
          voters, these must be declared. Declaration of your wallet ownership
          structure is done at the time you complete a form at
          {kycFormLink}.
        </p>
      </div>
    ),
  },
  {
    question: 'I already completed KYC/KYB. Do I have to do it again?',
    answer: (
      <div>
        <p>
          Not if you passed KYC within the last year. We consider your KYC/KYB
          to be clear for 1 year following the approval date.
        </p>
        <p>
          If you will be using a new L2 wallet that we have not yet used for a
          grant, you will need to complete the form at {kycFormLink} for your
          new wallet.
        </p>
      </div>
    ),
  },
  {
    question: 'I received more than one grant. Do I have to KYC for both?',
    answer: (
      <p>
        You only need to complete KYC one time, and your clearance is good for 1
        year from completion. If you use different wallets for each project,
        please fill out {kycFormLink} for each wallet. Please note, each grant
        must be directed to a single wallet.
      </p>
    ),
  },
  {
    question: 'Can I be the one to KYC on behalf of my organization?',
    answer: (
      <p>No. We need to KYB the organization that is receiving the grant.</p>
    ),
  },
  {
    question: 'I tried to complete KYC but failed. What should I do?',
    answer: (
      <div>
        <ul className="list-decimal pl-5">
          <li>
            Make sure you're in a well lit location with a good quality camera
            on your device.
          </li>
          <li>
            Make sure the document is legible and there is no glare on the
            document.
          </li>
          <li>
            If there are variations to the spelling of your name, make sure the
            name we have on file matches your name exactly as it appears on your
            ID document.
          </li>
          <li>
            If you're having trouble with one ID, try an alternative form. We
            accept passports, international driver's licenses, and other forms
            of national ID.
          </li>
        </ul>
        <p className="mt-2">
          You can try multiple times in each session, but if you still have
          issues, please email{' '}
          <span className="font-semibold">compliance@optimism.io</span>.
        </p>
      </div>
    ),
  },
  {
    question: 'I live in _____. Can I pass KYC?',
    answer: (
      <div>
        <p>
          We are unable to make grants to residents of the following countries:
        </p>
        <ul className="list-disc pl-5">
          <li>Cuba</li>
          <li>Belarus</li>
          <li>Democratic Republic of Congo</li>
          <li>Iran</li>
          <li>North Korea</li>
          <li>The Russian Federation</li>
          <li>Syria</li>
          <li>Yemen</li>
          <li>The Crimea, Donetsk, or Luhansk regions of Ukraine</li>
        </ul>
        <p className="mt-2">
          This list is subject to change with evolving laws and sanctions
          regimes, and may not be complete. The Optimism Foundation will not
          clear any person or business if we have reason to believe they do not
          intend to use their grant or their position in compliance with all
          applicable laws.
        </p>
      </div>
    ),
  },
]
