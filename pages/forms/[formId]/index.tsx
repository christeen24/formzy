import Link from 'next/link'
import {
  Heading,
  Box,
  Flex,
  IconButton,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/core'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { redirectUser, ssrFetch } from '../../../src/lib/helpers'
import React, { useMemo } from 'react'
import { useFormData } from '../../../src/hooks'
import SubmissionList from '../../../src/components/SubmissionList'
import Loading from '../../../src/components/Loading'
import ErrorComponent from '../../../src/components/Error'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  res,
}) => {
  try {
    if (params?.formId) {
      const data = await ssrFetch(`/forms/${params.formId}`, req)
      return { props: { data } }
    }
  } catch (e) {
    redirectUser(res)
  }
  return { props: { data: {} } }
}

const FormsPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { query, push } = useRouter()
  const { data, error } = useFormData(query.formId as string, props.data)

  const spamSubmissions = useMemo(
    () => data?.submissions.filter((submission) => submission.isSpam) || [],
    [data?.submissions]
  )
  const regularSubmissions = useMemo(
    () => data?.submissions.filter((submission) => !submission.isSpam) || [],
    [data?.submissions]
  )

  if (error) return <ErrorComponent />
  if (!data) return <Loading />

  return (
    <Box w="full">
      <Link href="/">
        <IconButton
          aria-label="go back"
          icon="arrow-back"
          variantColor="green"
          mb={6}
        />
      </Link>
      <Flex justifyContent="space-between" mb={6}>
        <Box>
          <Heading size="2xl">{data.name}</Heading>
          <Heading size="sm" color="gray.600">
            FormID: {data.id}
          </Heading>
        </Box>
        <IconButton
          icon="settings"
          aria-label="settings"
          variantColor="blue"
          onClick={() => {
            push(`/forms/${data.id}/settings`)
          }}
        />
      </Flex>
      <Tabs variant="solid-rounded" variantColor="green">
        <TabList>
          <Tab>Submissions</Tab>
          <Tab>Spam</Tab>
        </TabList>
        <TabPanels py={8}>
          <TabPanel>
            <SubmissionList submissions={regularSubmissions} />
          </TabPanel>
          <TabPanel>
            <SubmissionList submissions={spamSubmissions} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default FormsPage
