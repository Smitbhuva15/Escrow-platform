export const messages = [
    {
        "que": "Who holds the funds after I create a deal?",
        "ans": "The funds are locked in a smart contract and cannot be moved by buyer, seller, or admin until the deal is completed or a dispute is resolved."
    },
    {
        "que": "What happens if the buyer never confirms delivery?",
        "ans": "If the seller marked the work as delivered and the buyer does nothing, the deal stays in “Delivered” until the deadline passes. After that, the seller can request DAO resolution."
    },
    {
        "que": "Can a seller raise a dispute?",
        "ans": "Yes. If a buyer refuses to release funds despite valid delivery, the seller can open a dispute for the DAO to vote on."
    },
      {
        "que": "Can a buyer raise a dispute?",
        "ans": "Yes. If the product or service doesn’t meet your expectations, or if there’s any issue with the transaction, you can open a dispute. The platform then locks the funds and lets the DAO voters review the case and decide a fair outcome."
    },
    {
        "que": "Can I withdraw my stake anytime?",
        "ans": "Yes, but only the amount not locked in active disputes can be unstaked immediately. Any stake tied to open votes is released once those disputes close."
    },
    {
        "que": "What happens if quorum is not reached in a dispute?",
        "ans": "If the required quorum is not met by the voting deadline, the contract refunds the buyer by default to minimize risk."
    },
  
    
  
];