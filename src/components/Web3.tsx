import Devnet from './Devnet';

const Web3 = () => (
  <section class="act wrap" id="web3" aria-labelledby="web3-h">
    <div class="duo2">
      <div>
        <p class="eyebrow">Web3 · Fuel Network and Concrete</p>
        <h2 id="web3-h" class="tight">
          Interfaces that tell the truth about a slow chain.
        </h2>
        <p class="body">
          A chain is slower and less certain than a server. The interface has to
          say exactly what is signed, what is pending and what is final. I built
          that into the Fuel Wallet and its connectors.
        </p>
      </div>
      <div
        class="slot"
        id="s3"
        data-shape="chain"
        role="img"
        aria-label="A chain of four linked blocks"
      />
    </div>
    <Devnet />
  </section>
);

export default Web3;
