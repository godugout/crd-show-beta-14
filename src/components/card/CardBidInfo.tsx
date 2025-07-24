
import React from "react";
import { Button } from "@/components/ui/button";

const formatCredits = (amount: number | string) => {
  const n = typeof amount === "number" ? amount : parseInt(amount);
  return (
    <>
      <span className="align-middle font-extrabold">{n}</span>
      <span className="ml-1">C</span>
    </>
  );
};

export const CardBidInfo = () => {
  const highestBid = 146;
  const usd = 2764;
  const serviceFeeCredits = 256;
  const serviceFeeUsd = 4540;

  return (
    <div className="flex flex-col gap-8 px-4 py-4 border border-border bg-card rounded-2xl shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-raleway font-semibold text-muted-foreground">
            Highest bid by
          </span>
          <span className="text-sm font-raleway font-semibold text-foreground">
            Kohaku Tora
          </span>
          <span className="text-xl font-raleway font-bold text-foreground flex items-center gap-1">
            {formatCredits(highestBid)}
          </span>
          <span className="text-xl font-raleway font-bold text-muted-foreground">
            ${usd.toLocaleString()}
          </span>
        </div>
        <div className="w-12 h-12 rounded-full bg-crd-green relative">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d51e97c03168fc86320c5b5288785196fd658cf"
            alt="Bidder Avatar"
            className="w-12 h-[72px] absolute -top-1 left-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button className="flex-1 bg-crd-blue hover:bg-crd-blue/90 text-lg font-raleway font-extrabold rounded-[90px]">
          Purchase now
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-2 border-border text-lg font-raleway font-extrabold rounded-[90px]"
        >
          Place a bid
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-poppins text-muted-foreground">
          Service fee
        </span>
        <span className="text-sm font-poppins text-foreground">1.5%</span>
        <span className="text-sm font-poppins text-foreground flex items-center gap-1">
          {formatCredits(serviceFeeCredits)}
        </span>
        <span className="text-sm font-poppins text-muted-foreground">
          ${serviceFeeUsd.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
