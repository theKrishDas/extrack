import { Button } from "@/components/ui/button"
import { InsetList } from "@/components/ui/inset-list"

export function ProfileDetail(props: {
  displayName: string
  email: string
  userId: string
  onCopyUserId: () => void
}) {
  return (
    <InsetList.Root>
      <InsetList.Section>
        <InsetList.SectionHeader>
          <InsetList.SectionTitle>Profile</InsetList.SectionTitle>
        </InsetList.SectionHeader>
        <InsetList.Item>
          <InsetList.ItemLeading>
            <InsetList.ItemMedia
              className="text-ios-blue text-xl"
              variant="symbol"
            >
              􀉭
            </InsetList.ItemMedia>
          </InsetList.ItemLeading>
          <InsetList.ItemContent>
            <InsetList.ItemBody>
              <InsetList.ItemTitle>Name</InsetList.ItemTitle>
              <InsetList.ItemSubtitle>
                {props.displayName}
              </InsetList.ItemSubtitle>
            </InsetList.ItemBody>
          </InsetList.ItemContent>
        </InsetList.Item>
        <InsetList.Item>
          <InsetList.ItemLeading>
            <InsetList.ItemMedia className="text-ios-cyan" variant="symbol">
              􀍚
            </InsetList.ItemMedia>
          </InsetList.ItemLeading>
          <InsetList.ItemContent>
            <InsetList.ItemBody>
              <InsetList.ItemTitle>Email</InsetList.ItemTitle>
              <InsetList.ItemSubtitle>{props.email}</InsetList.ItemSubtitle>
            </InsetList.ItemBody>
          </InsetList.ItemContent>
        </InsetList.Item>
      </InsetList.Section>

      <InsetList.Section>
        <InsetList.SectionHeader>
          <InsetList.SectionTitle>Developer</InsetList.SectionTitle>
        </InsetList.SectionHeader>
        <InsetList.Item>
          <InsetList.ItemLeading>
            <InsetList.ItemMedia
              className="text-ios-purple text-xl"
              variant="symbol"
            >
              􀤆
            </InsetList.ItemMedia>
          </InsetList.ItemLeading>
          <InsetList.ItemContent>
            <InsetList.ItemBody>
              <InsetList.ItemTitle>User ID</InsetList.ItemTitle>
              <InsetList.ItemSubtitle className="truncate font-mono text-[0.92rem] lowercase">
                {props.userId}
              </InsetList.ItemSubtitle>
            </InsetList.ItemBody>

            <InsetList.ItemTrailing className="flex min-h-13 items-center">
              <Button
                color="gray"
                isIconOnly
                onPress={props.onCopyUserId}
                size="xs"
                variant="ghost"
              >
                <span className="sr-only">Copy</span>
                <span aria-hidden="true">􀉃</span>
              </Button>
            </InsetList.ItemTrailing>
          </InsetList.ItemContent>
        </InsetList.Item>

        <InsetList.SectionFooter>
          <InsetList.SectionDescription>
            This information is only visible to you and can be used for
            debugging or support purposes.
          </InsetList.SectionDescription>
        </InsetList.SectionFooter>
      </InsetList.Section>
    </InsetList.Root>
  )
}
