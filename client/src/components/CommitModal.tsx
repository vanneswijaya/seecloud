/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Select } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";

export const CommitModal = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const [branchList, setBranchList] = useState([]);

  useEffect(() => {
    const fetchBranchList = async () => {
      const url = "http://localhost:8080/list-branches";
      try {
        const response = await axios.get(url);
        setBranchList(response.data.data.map((x: any) => x.name));
      } catch (error) {
        console.error(error);
      }
    };
    fetchBranchList();
  }, []);

  return (
    <Modal opened={opened} onClose={close} title="Create new commit" centered>
      <Select
        label="Branch"
        placeholder="Select branch for commit"
        data={branchList}
        searchable
      />
    </Modal>
  );
};
