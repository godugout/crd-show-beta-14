
import React from "react";

const formatCredits = (amount: number | string) => {
  const n = typeof amount === "number" ? amount : parseInt(amount);
  return (
    <>
      <span className="align-middle font-extrabold">{n}</span>
      <span className="ml-1">C</span>
    </>
  );
};

export const CardInfo = () => {
  // Demo data updated to use credits instead of coins/ETH
  const creditValue = 25;
  const usdValue = 4429;
  const stock = 10;
  
  return (
    <div className="flex-1 space-y-16">
      <div className="space-y-10">
        <h1 className="font-raleway text-4xl font-black">The amazing art</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 text-lg font-raleway font-extrabold border-2 border-crd-green text-crd-green rounded flex items-center gap-1">
            {formatCredits(creditValue)}
          </span>
          <span className="px-2 py-1 text-lg font-raleway font-extrabold border-2 border-border text-muted-foreground rounded">
            ${usdValue.toLocaleString()}
          </span>
          <span className="text-lg font-raleway font-extrabold text-muted-foreground">
            {stock} in stock
          </span>
        </div>
      </div>

      <p className="text-muted-foreground">
        This NFT Card will give you Access to Special Airdrops. To learn more about UI8 please visit{" "}
        <a href="https://ui8.net" className="text-foreground underline">
          https://ui8.net
        </a>
      </p>
    </div>
  );
};
