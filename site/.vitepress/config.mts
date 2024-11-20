import { defineConfig } from 'vitepress'

// Helper function to create a menu item
const createMenuItem = (text, link) => ({ text, link })

// Helper function to create a submenu for L1 or L2
const createSubMenu = (platform, actions) => ({
  text: platform,
  items: actions.map(action => createMenuItem(action.text, action.link)),
})

// Define action links for L1 and L2
const l1Actions = [
  { text: 'getL2HashesForDepositTx', link: '/docs/actions/public/L1/getL2HashesForDepositTx' },
  { text: 'getOutputForL2Block', link: '/docs/actions/public/L1/getOutputForL2Block' },
  { text: 'getSecondsToFinalizable', link: '/docs/actions/public/L1/getSecondsToFinalizable' },
  { text: 'getSecondsToNextL2Output', link: '/docs/actions/public/L1/getSecondsToNextL2Output' },
  { text: 'readFinalizedWithdrawals', link: '/docs/actions/public/L1/readFinalizedWithdrawals' },
  { text: 'readProvenWithdrawals', link: '/docs/actions/public/L1/readProvenWithdrawals' },
  { text: 'simulateDepositERC20', link: '/docs/actions/public/L1/simulateDepositERC20' },
  { text: 'simulateDepositETH', link: '/docs/actions/public/L1/simulateDepositETH' },
  { text: 'simulateDepositTransaction', link: '/docs/actions/public/L1/simulateDepositTransaction' },
  { text: 'simulateFinalizeWithdrawalTransaction', link: '/docs/actions/public/L1/simulateFinalizeWithdrawalTransaction' },
  { text: 'simulateProveWithdrawalTransaction', link: '/docs/actions/public/L1/simulateProveWithdrawalTransaction' },
]

const l2Actions = [
  { text: 'estimateFees', link: '/docs/actions/public/L2/estimateFees' },
  { text: 'estimateL1Fee', link: '/docs/actions/public/L2/estimateL1Fee' },
  { text: 'estimateL1GasUsed', link: '/docs/actions/public/L2/estimateL1GasUsed' },
  { text: 'getProveWithdrawalTransactionArgs', link: '/docs/actions/public/L2/getProveWithdrawalTransactionArgs' },
  { text: 'getWithdrawalMessages', link: '/docs/actions/public/L2/getWithdrawalMessages' },
  { text: 'simulateWithdrawERC20', link: '/docs/actions/public/L2/simulateWithdrawERC20' },
  { text: 'simulateWithdrawETH', link: '/docs/actions/public/L2/simulateWithdrawETH' },
]

// Main configuration for VitePress
export default defineConfig({
  title: 'OP Viem',
  description: 'Viem extensions for the OP Stack',
  ignoreDeadLinks: true,  // Set this to false before production

  themeConfig: {
    // Navigation bar
    nav: [{ text: 'Docs', link: '/' }],
    
    search: { provider: 'local' },

    // Sidebar structure
    sidebar: [
      {
        text: 'Introduction',
        items: [
          createMenuItem('Getting started', '/'),
          createMenuItem('Examples', '/docs/examples'),
        ],
      },
      {
        text: 'Public Actions',
        items: [
          createSubMenu('L1', l1Actions),
          createSubMenu('L2', l2Actions),
        ],
      },
      {
        text: 'Wallet Actions',
        items: [
          createSubMenu('L1', [
            { text: 'writeContractDeposit', link: '/docs/actions/wallet/L1/writeContractDeposit' },
            { text: 'writeDepositERC20', link: '/docs/actions/wallet/L1/writeDepositERC20' },
            { text: 'writeDepositETH', link: '/docs/actions/wallet/L1/writeDepositETH' },
            { text: 'writeFinalizeWithdrawalTransaction', link: '/docs/actions/wallet/L1/writeFinalizeWithdrawalTransaction' },
            { text: 'writeOpStackL1', link: '/docs/actions/wallet/L1/writeOpStackL1' },
            { text: 'writeProveWithdrawalTransaction', link: '/docs/actions/wallet/L1/writeProveWithdrawalTransaction' },
            { text: 'writeSendMessage', link: '/docs/actions/wallet/L1/writeSendMessage' },
            { text: 'writeDepositTransaction', link: '/docs/actions/wallet/L1/writeDepositTransaction' },
          ]),
          createSubMenu('L2', [
            { text: 'writeOpStackL2', link: '/docs/actions/wallet/L2/writeOpStackL2' },
            { text: 'writeWithdrawETH', link: '/docs/actions/wallet/L2/writeWithdrawETH' },
            { text: 'writeWithdrawERC20', link: '/docs/actions/wallet/L2/writeWithdrawERC20' },
          ]),
        ],
      },
      {
        text: 'Utilities',
        items: [
          {
            text: 'Deposits',
            items: [
              { text: 'getDepositTransaction', link: '/docs/utilities/deposits/getDepositTransaction' },
              { text: 'getL2HashFromL1DepositInfo', link: '/docs/utilities/deposits/getL2HashFromL1DepositInfo' },
              { text: 'getSourceHash', link: '/docs/utilities/deposits/getSourceHash' },
              { text: 'getTransactionDepositedEvents', link: '/docs/utilities/deposits/getTransactionDepositedEvents' },
              { text: 'rlpEncodeDepositTransaction', link: '/docs/utilities/deposits/rlpEncodeDepositTransaction' },
            ],
          },
          {
            text: 'Withdrawals',
            items: [
              { text: 'getWithdrawalMessageStorageSlot', link: '/docs/utilities/withdrawals/getWithdrawalMessageStorageSlot' },
            ],
          },
        ],
      },
      {
        text: 'Glossary',
        items: [
          createMenuItem('Types', '/docs/glossary/types'),
        ],
      },
    ],

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/base-org/op-viem' },
    ],
  },
})
