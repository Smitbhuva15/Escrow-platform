export const messages = [
    {
        "que": "Who holds the funds after I create a deal?",
        "ans": "The funds are locked in a smart contract and cannot be moved by client, specialist, or admin until the deal is completed or a dispute is resolved."
    },
    {
        "que": "What happens if the client never confirms delivery?",
        "ans": "If the specialist marked the work as delivered and the client does nothing, the deal stays in “Delivered” until the deadline passes. After that, the specialist can request DAO resolution."
    },
    {
        "que": "Can a specialist raise a dispute?",
        "ans": "Yes. If a client refuses to release funds despite valid delivery, the specialist can open a dispute for the DAO to vote on."
    },
      {
        "que": "Can a client raise a dispute?",
        "ans": "Yes. If the product or service doesn’t meet your expectations, or if there’s any issue with the transaction, you can open a dispute. The platform then locks the funds and lets the DAO voters review the case and decide a fair outcome."
    },
    {
        "que": "Can I withdraw my stake anytime?",
        "ans": "Yes, but only the amount not locked in active disputes can be unstaked immediately. Any stake tied to open votes is released once those disputes close."
    },
    {
        "que": "What happens if quorum is not reached in a dispute?",
        "ans": "If the required quorum is not met by the voting deadline, the contract refunds the client by default to minimize risk."
    },
  
    
  
];