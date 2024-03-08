import { truncateHash } from '@/utils/truncateHash'
import { Button } from '@eth-optimism/ui-components'
import { RiFileCopyLine } from '@remixicon/react'
import { Hex } from 'viem'

export const CopiableHash = ({ hash, href }: { hash: Hex; href?: string }) => {
  return (
    <div className="flex items-center font-mono ">
      {href ? (
        <a href={href} className="hover:opacity-70 font-mono ">
          {truncateHash(hash)}
        </a>
      ) : (
        truncateHash(hash)
      )}
      <Button
        className="ml-1"
        variant="ghost"
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(hash)
        }}
      >
        <RiFileCopyLine className=" h-4 w-4" />
      </Button>
    </div>
  )
}
