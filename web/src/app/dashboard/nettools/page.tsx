"use client";
import Cards from "@/components/Cards";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { CiImport } from "react-icons/ci";
import Link from "next/link";
import ApiClient from "@/api";
import { useState } from "react";
import NettoolModal from "@/components/Popup/Nettools/NettoolModal";
import {
  NettoolsTypes,
  type NettoolModalType,
  type Nettools,
} from "@/types/nettools";
import { useDisclosure } from "@nextui-org/react";
import ResponseModal from "@/components/Popup/ResponseModal";

const subcategoryCards = [
  {
    title: "IP Info",
    description: "Get detailed information about IP addresses.",
    type: NettoolsTypes.IPINFO,
    icon: IoIosInformationCircleOutline,
  },
  {
    title: "Mac Address Info",
    description: "Retrieve information about MAC addresses.",
    type: NettoolsTypes.MACLOOKUP,
    icon: IoIosInformationCircleOutline,
  },
  {
    title: "Portscan",
    description: "Scan the available ports on a given IP address.",
    type: NettoolsTypes.PORTSCAN,
    icon: CiImport,
  },
];

const apiClient = new ApiClient();

const Nettools = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isResponseModalOpen,
    onOpen: openResponseModal,
    onOpenChange: setResponseModalOpen,
  } = useDisclosure();
  const [modalType, setModalType] = useState<NettoolModalType>();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCardClick = (type: NettoolModalType) => {
    setModalType(type);
    onOpen();
  };

  const handleRequest = async (data: Nettools) => {
    if (!modalType) {
      return;
    }

    setIsLoading(true);
    try {
      const response =
        modalType === NettoolsTypes.IPINFO
          ? await apiClient.nettools.helper.ipInfo(data.ip)
          : modalType === NettoolsTypes.MACLOOKUP
          ? await apiClient.nettools.helper.lookupMacAddress(data.mac)
          : await apiClient.nettools.helper.portScanner(
              data.ip,
              data.startPort,
              data.endPort
            );
      setResult(response.data);
      setIsLoading(false);
      openResponseModal();
      onOpenChange();
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="p-6">
        {/* Center the title */}
        <h1 className="text-white text-3xl mb-6 text-center">Nettools</h1>

        {/* Center the cards and make them appear side by side */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center mx-auto">
          {subcategoryCards.map((card) => (
            <Cards
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
              onClick={() => handleCardClick(card.type)}
            />
          ))}
        </ul>

        {/* Center the "Home" button */}
        <div className="flex justify-center mt-6">
          <Link href="/dashboard">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors">
              Home
            </button>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <NettoolModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        type={modalType!}
        onSubmit={handleRequest}
        onOpen={onOpen}
        isLoading={isLoading}
      />

      <ResponseModal
        isOpen={isResponseModalOpen}
        onOpenChange={setResponseModalOpen}
        result={result}
        onOpen={openResponseModal}
      />
    </div>
  );
};

export default Nettools;
