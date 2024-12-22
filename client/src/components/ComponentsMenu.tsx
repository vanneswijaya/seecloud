/* eslint-disable @next/next/no-img-element */
import { Card, Text, Flex } from "@mantine/core";
import {
  ComponentData,
  GenericService,
  IamTemplate,
  ImportedInstance,
} from "../common/types";
import jsonData from "../common/component-map.json";
import {
  IconBrandAws,
  IconChevronDown,
  IconFileImport,
  IconLockCheck,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";

export const ComponentsMenu = ({
  onDragComponent,
}: {
  onDragComponent: (draggedComponent: ComponentData) => void;
}) => {
  const loadData = JSON.parse(JSON.stringify(jsonData));
  const iamTemplateValues: IamTemplate[] = Object.values(
    loadData["iam-templates"]
  );
  const genericServiceValues: GenericService[] = Object.values(
    loadData["generic-services"]
  );
  const [importedInstances, setImportedInstances] = useState<
    ImportedInstance[]
  >([]);

  useEffect(() => {
    let imported: ImportedInstance[] = [];
    const fetchEC2 = async () => {
      const url = "http://localhost:8080/list-ec2-reservations";
      try {
        const response = await axios.get(url);
        imported = imported.concat(
          response.data["Reservations"].reduce(
            (
              array: ImportedInstance[],
              reservation: {
                Instances: {
                  InstanceId: string;
                  Tags: { Key: string; Value: string }[];
                }[];
              }
            ) => {
              reservation["Instances"].forEach((instance) => {
                array.push({
                  type: "imported-instance",
                  iconPath: "icons/ec2.png",
                  typeName: "EC2 instance",
                  arn:
                    "arn:aws:ec2:us-east-1:221418973682:instance/" +
                    instance["InstanceId"],
                  name: instance["Tags"].filter((x) => x["Key"] === "Name")[0][
                    "Value"
                  ],
                  instanceId: instance["InstanceId"],
                  actions: ["ec2:StartInstances", "ec2:StopInstances"],
                });
              });
              return array;
            },
            []
          )
        );
        fetchS3();
      } catch (error) {
        console.error(error);
      }
    };
    const fetchS3 = async () => {
      const url = "http://localhost:8080/list-s3-buckets";
      try {
        const response = await axios.get(url);
        imported = imported.concat(
          response.data["Buckets"].map((bucket: { Name: string }) => {
            return {
              type: "imported-instance",
              iconPath: "icons/s3.png",
              typeName: "S3 bucket",
              arn: "arn:aws:s3:::" + bucket["Name"],
              name: bucket["Name"],
              instanceId: bucket["Name"],
              actions: [
                "s3:ListBucket",
                "s3:GetBucketLocation",
                "s3:PutObject",
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:DeleteObject",
                "s3:DeleteObjectVersion",
              ],
            };
          })
        );
        fetchRDS();
      } catch (error) {
        console.error(error);
      }
    };
    const fetchRDS = async () => {
      const url = "http://localhost:8080/list-rds-instances";
      try {
        const response = await axios.get(url);
        imported = imported.concat(
          response.data["DBInstances"].map(
            (db: { DBInstanceIdentifier: string }) => {
              return {
                type: "imported-instance",
                iconPath: "icons/rds.png",
                typeName: "RDS DB instance",
                arn:
                  "arn:aws:rds:us-east-1:221418973682:db:" +
                  db["DBInstanceIdentifier"],
                name: db["DBInstanceIdentifier"],
                instanceId: db["DBInstanceIdentifier"],
                actions: [
                  "s3:ListBucket",
                  "s3:GetBucketLocation",
                  "s3:PutObject",
                  "s3:GetObject",
                  "s3:GetObjectVersion",
                  "s3:DeleteObject",
                  "s3:DeleteObjectVersion",
                ],
              };
            }
          )
        );
        setImportedInstances(imported);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEC2();
  }, []);

  return (
    <Flex direction="column" gap="xl">
      <Flex direction="column" gap="sm">
        <Flex justify="space-between">
          <Flex gap="xs">
            <IconLockCheck />
            <Text fw="bolder">IAM Templates</Text>
          </Flex>
          <IconChevronDown />
        </Flex>
        {iamTemplateValues.map((iamTemplate, idx) => {
          return (
            <Card
              key={idx}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              draggable="true"
              onDragStart={() =>
                onDragComponent({ ...iamTemplate, type: "iam-template" })
              }
            >
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                mt="md"
                mb="xs"
              >
                <Text fw={500}>{iamTemplate.typeName}</Text>
                <img
                  height={60}
                  width={60}
                  alt={iamTemplate.typeName}
                  src={iamTemplate.iconPath}
                  draggable="false"
                />
              </Flex>
            </Card>
          );
        })}
      </Flex>
      <Flex direction="column" gap="sm">
        <Flex justify="space-between">
          <Flex gap="xs">
            <IconBrandAws />
            <Text fw="bolder">Generic Services</Text>
          </Flex>
          <IconChevronDown />
        </Flex>
        {genericServiceValues.map((genericService, idx) => {
          return (
            <Card
              key={idx}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              draggable="true"
              onDragStart={() =>
                onDragComponent({ ...genericService, type: "generic-service" })
              }
            >
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                mt="md"
                mb="xs"
              >
                <Text fw={500}>{genericService.typeName}</Text>
                <img
                  height={60}
                  width={60}
                  alt={genericService.typeName}
                  src={genericService.iconPath}
                  draggable="false"
                />
              </Flex>
            </Card>
          );
        })}
      </Flex>
      <Flex direction="column" gap="sm">
        <Flex justify="space-between">
          <Flex gap="xs">
            <IconFileImport />
            <Text fw="bolder">Imported Instances</Text>
          </Flex>
          <IconChevronDown />
        </Flex>
        {importedInstances.map((importedInstance, idx) => {
          return (
            <Card
              key={idx}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              draggable="true"
              onDragStart={() =>
                onDragComponent({
                  ...importedInstance,
                  type: "imported-instance",
                })
              }
            >
              <Flex
                direction="row"
                justify="space-between"
                align="center"
                gap="xl"
                mt="md"
                mb="xs"
              >
                <Flex direction="column">
                  <Text size="xs" fw={500}>
                    {importedInstance.typeName}
                  </Text>
                  <Text fw={700}>{importedInstance.name}</Text>
                </Flex>
                <img
                  height={60}
                  width={60}
                  alt={importedInstance.typeName}
                  src={importedInstance.iconPath}
                  draggable="false"
                />
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Flex>
  );
};
