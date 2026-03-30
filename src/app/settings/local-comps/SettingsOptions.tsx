"use client"

import { Avatar } from "@base-ui/react/avatar"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import {
  Collection,
  Header,
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "react-aria-components"
import { InsetList } from "@/components/ui/inset-list"
import { Skeleton } from "@/components/ui/loading/skeleton"
import { getInitials } from "@/components/user/helpers"
import { type SettingsOption, settingsConfig } from "./config"

type ListBoxItemRenderProps = Parameters<
  NonNullable<React.ComponentProps<typeof ListBoxItem>["render"]>
>[0]
type AnchorListBoxItemRenderProps = Extract<
  ListBoxItemRenderProps,
  { href?: unknown }
>

const LIST_BOX_ITEM_STYLE = {
  WebkitUserDrag: "none",
  userDrag: "none",
  WebkitTouchCallout: "none",
  cursor: "default",
  userSelect: "none",
  msUserSelect: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
} as React.CSSProperties

function isAnchorRenderProps(
  props: ListBoxItemRenderProps
): props is AnchorListBoxItemRenderProps & { href: string } {
  return "href" in props && typeof props.href === "string"
}

function getTrailingIcon(
  trailing: SettingsOption["trailing"] | null
): string | null {
  const trailingIcons: Record<
    Exclude<SettingsOption["trailing"], null>,
    string
  > = {
    chevron: "􀆊",
    "external-link": "􀰾",
  }
  const trailingIcon = trailing ? trailingIcons[trailing] : null
  return trailingIcon
}

function renderInsetSection({
  title,
  children,
  id,
}: {
  title: string
  children: React.ReactNode
  id?: string
}) {
  return (
    <ListBoxSection
      id={id}
      render={(domProps) => <InsetList.Section {...domProps} />}
    >
      <Header
        render={(domProps) => (
          <InsetList.SectionHeader {...domProps}>
            <InsetList.SectionTitle className="sr-only">
              {title}
            </InsetList.SectionTitle>
          </InsetList.SectionHeader>
        )}
      />
      {children}
    </ListBoxSection>
  )
}

/**
 * @todo: Promote to named components (<SettingsItem />) for error boundary isolation and DevTools visibility
 */
function renderInsetListLinkItem({
  children,
  href,
  id,
  textValue,
  target,
}: {
  children: React.ReactNode
  href?: string
  id?: string
  textValue?: string
  target?: "_blank" | "_self"
}) {
  const rel = target === "_blank" ? "noopener noreferrer" : undefined

  return (
    <ListBoxItem
      href={href}
      id={id}
      render={(domProps) => {
        if (isAnchorRenderProps(domProps)) {
          const { href: linkHref, ...linkProps } = domProps
          return (
            <InsetList.Item asChild>
              <Link href={linkHref} rel={rel} {...linkProps} />
            </InsetList.Item>
          )
        }
        return <InsetList.Item {...domProps} />
      }}
      style={LIST_BOX_ITEM_STYLE}
      target={target}
      textValue={textValue}
    >
      {children}
    </ListBoxItem>
  )
}

/**
 * @todo: Promote to named components (<ProfileItem />) for error boundary isolation and DevTools visibility
 */
function renderProfileItem({
  imageUrl,
  isLoading,
  fullName,
}: {
  imageUrl?: string
  isLoading: boolean
  fullName?: string | null
}) {
  return renderInsetListLinkItem({
    href: "/settings/profile",
    textValue: "Profile and security",
    children: (
      <>
        <InsetList.ItemLeading className="py-4">
          <InsetList.ItemMedia
            className="rounded-full bg-none"
            size="tall"
            variant="fill"
          >
            {isLoading ? (
              <Skeleton
                aria-label="Loading user avatar"
                className="size-full rounded-full bg-fill-primary"
              />
            ) : (
              <Avatar.Root className="grid size-full place-items-center overflow-hidden rounded-full bg-ios-purple font-semibold text-white text-xs">
                <Avatar.Image
                  alt="User avatar"
                  className="size-full object-cover"
                  height={60}
                  src={imageUrl}
                  width={60}
                />
                <Avatar.Fallback>{getInitials(fullName)}</Avatar.Fallback>
              </Avatar.Root>
            )}
          </InsetList.ItemMedia>
        </InsetList.ItemLeading>

        <InsetList.ItemContent>
          <InsetList.ItemBody>
            {isLoading ? (
              <Skeleton
                aria-label="Loading user name"
                className="mb-2 h-5 w-28 rounded-md bg-fill-primary"
              />
            ) : (
              <InsetList.ItemTitle className="font-bold text-lg">
                {fullName ?? "User"}
              </InsetList.ItemTitle>
            )}
            <InsetList.ItemSubtitle>
              Profile and security
            </InsetList.ItemSubtitle>
          </InsetList.ItemBody>

          <InsetList.ItemTrailing className="text-label-tertiary">
            {getTrailingIcon("chevron")}
          </InsetList.ItemTrailing>
        </InsetList.ItemContent>
      </>
    ),
  })
}

function renderSettingsItem(option: SettingsOption) {
  const rel = option.external ? "noopener noreferrer" : undefined

  return (
    <ListBoxItem
      id={option.name}
      {...(option.href
        ? {
            href: option.href,
            target: option.external ? "_blank" : "_self",
          }
        : {})}
      render={(domProps) => {
        if (isAnchorRenderProps(domProps)) {
          const { href: linkHref, ...linkProps } = domProps
          return (
            <InsetList.Item asChild>
              <Link href={linkHref} rel={rel} {...linkProps} />
            </InsetList.Item>
          )
        }
        return <InsetList.Item {...domProps} />
      }}
      style={LIST_BOX_ITEM_STYLE}
      textValue={option.label}
    >
      <InsetList.ItemLeading>
        <InsetList.ItemMedia
          style={{
            backgroundColor:
              option.iconColor === "gray"
                ? "var(--gray-2)"
                : `var(--ios-${option.iconColor})`,
          }}
          variant="rounded"
        >
          <span className="text-white">{option.icon}</span>
        </InsetList.ItemMedia>
      </InsetList.ItemLeading>

      <InsetList.ItemContent>
        <InsetList.ItemBody>
          <InsetList.ItemTitle>{option.label}</InsetList.ItemTitle>
        </InsetList.ItemBody>

        <InsetList.ItemTrailing className="text-label-tertiary">
          {getTrailingIcon(option.trailing)}
        </InsetList.ItemTrailing>
      </InsetList.ItemContent>
    </ListBoxItem>
  )
}

export function OptionList() {
  const { isLoaded, isSignedIn, user } = useUser()
  const showProfileItem = !isLoaded || isSignedIn

  return (
    <InsetList.Root asChild>
      <ListBox aria-label="Settings" selectionMode="none">
        {showProfileItem
          ? renderInsetSection({
              title: "Profile",
              children: renderProfileItem({
                fullName: user?.fullName,
                imageUrl: user?.imageUrl,
                isLoading: !isLoaded,
              }),
            })
          : null}
        <Collection items={settingsConfig}>
          {(group) => (
            <ListBoxSection
              id={group.name}
              render={(domProps) => <InsetList.Section {...domProps} />}
            >
              <Header
                render={(domProps) => (
                  <InsetList.SectionHeader {...domProps}>
                    <InsetList.SectionTitle className="sr-only">
                      {group.label}
                    </InsetList.SectionTitle>
                  </InsetList.SectionHeader>
                )}
              />
              <Collection items={group.options}>
                {(option) => renderSettingsItem(option)}
              </Collection>
            </ListBoxSection>
          )}
        </Collection>
      </ListBox>
    </InsetList.Root>
  )
}
