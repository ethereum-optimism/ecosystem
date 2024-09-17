import { FAQS, SUPPORT_URL } from '@/constants'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
} from '@eth-optimism/ui-components'
import { HeaderLogo } from './HeaderLogo'

const FaqPage = () => {
  return (
    <div>
      <div className="p-6">
        <HeaderLogo />
      </div>
      <div className="flex flex-col w-full items-center px-4 pb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">KYC FAQ</h1>
        <p className="text-secondary-foreground mb-10 text-center">
          Frequently asked questions for identity verification
        </p>

        <Card className="px-6 py-4 w-full max-w-4xl">
          <Accordion type="multiple">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className={index === FAQS.length - 1 ? 'border-b-0' : ''}
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <p className="text-muted-foreground text-sm mt-10">
          Still need help? <a href={SUPPORT_URL}>Contact support</a>
        </p>
      </div>
    </div>
  )
}

export { FaqPage }
