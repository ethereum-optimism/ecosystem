import { Route, Routes } from 'react-router-dom'

import DeployingSuperchainERC20 from '@/guides/DeployingSuperchainERC20.mdx'

export const GuideRoute = () => (
  <Routes>
    <Route
      path="deploying-superchain-erc20"
      element={<DeployingSuperchainERC20 />}
    />
  </Routes>
)
