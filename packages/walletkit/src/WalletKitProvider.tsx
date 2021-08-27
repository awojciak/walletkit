import { SolanaProvider } from "@saberhq/use-solana";
import React, { useContext, useMemo, useState } from "react";

import { WalletSelectorModal } from "./components/WalletSelectorModal";

export interface WalletKit {
  connect: () => void;
}

const WalletKitContext = React.createContext<WalletKit | null>(null);

interface Props {
  children: React.ReactNode;
}

export const WalletKitProvider: React.FC<Props> = ({ children }: Props) => {
  const [showWalletSelector, setShowWalletSelector] = useState<boolean>(false);

  const kit = useMemo(() => {
    return { connect: () => setShowWalletSelector(true) };
  }, []);

  return (
    <SolanaProvider>
      <WalletKitContext.Provider value={kit}>
        <WalletSelectorModal
          isOpen={showWalletSelector}
          onDismiss={() => setShowWalletSelector(false)}
        />
        {children}
      </WalletKitContext.Provider>
    </SolanaProvider>
  );
};

/**
 * Returns a function which shows the wallet selector modal.
 */
export const useWalletKit = (): WalletKit => {
  const kit = useContext(WalletKitContext);
  if (!kit) {
    throw new Error("Not in WalletConnector context");
  }
  return kit;
};
