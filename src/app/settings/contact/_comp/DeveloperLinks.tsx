"use client"

import { Link } from "react-aria-components"
import { DEVELOPER } from "#lib/config/developer"
import {
  MaterialSymbolsAlternateEmail,
  RiTwitterXLine,
} from "@/components/icons/social"
import { InsetList } from "@/components/ui/inset-list"

type Social = (typeof DEVELOPER.socials)[number]

const colorMap: Record<string, string> = {
  email: "bg-ios-blue text-white",
  website: "bg-ios-indigo",
  twitter: "bg-black text-white",
}

export function DeveloperLinks() {
  return (
    <InsetList.Root>
      <InsetList.Section asChild>
        <section>
          {/* Email */}
          <InsetList.Item asChild>
            <Link
              className="data-pressed:bg-fill-tertiary"
              href={`mailto:${DEVELOPER.email}`}
            >
              <InsetList.ItemLeading>
                <InsetList.ItemMedia
                  className={colorMap.email}
                  variant="rounded"
                >
                  <MaterialSymbolsAlternateEmail />
                </InsetList.ItemMedia>
              </InsetList.ItemLeading>

              <InsetList.ItemContent>
                <InsetList.ItemBody>
                  <InsetList.ItemTitle>Email</InsetList.ItemTitle>
                </InsetList.ItemBody>

                <InsetList.ItemTrailing>
                  <span className="text-label-secondary">↗</span>
                </InsetList.ItemTrailing>
              </InsetList.ItemContent>
            </Link>
          </InsetList.Item>

          {/* Website */}
          <InsetList.Item asChild>
            <Link
              className="data-pressed:bg-fill-tertiary"
              href={DEVELOPER.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              <InsetList.ItemLeading>
                <InsetList.ItemMedia
                  className={colorMap.website}
                  variant="rounded"
                >
                  <span className="text-white">􀆪</span>
                </InsetList.ItemMedia>
              </InsetList.ItemLeading>

              <InsetList.ItemContent>
                <InsetList.ItemBody>
                  <InsetList.ItemTitle>Website</InsetList.ItemTitle>
                </InsetList.ItemBody>

                <InsetList.ItemTrailing>
                  <span className="text-label-secondary">↗</span>
                </InsetList.ItemTrailing>
              </InsetList.ItemContent>
            </Link>
          </InsetList.Item>

          {/* Social Links */}
          {DEVELOPER.socials.map((social: Social) => (
            <InsetList.Item asChild key={social.platform}>
              <Link
                className="data-pressed:bg-fill-tertiary"
                href={social.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <InsetList.ItemLeading>
                  <InsetList.ItemMedia
                    className={colorMap[social.platform] || "bg-ios-blue"}
                    variant="rounded"
                  >
                    <span className="text-white">
                      {social.platform === "twitter" ? <RiTwitterXLine /> : "􀉭"}
                    </span>
                  </InsetList.ItemMedia>
                </InsetList.ItemLeading>

                <InsetList.ItemContent>
                  <InsetList.ItemBody>
                    <InsetList.ItemTitle className="capitalize">
                      {social.platform}
                    </InsetList.ItemTitle>
                  </InsetList.ItemBody>

                  <InsetList.ItemTrailing>
                    <span className="text-label-secondary">
                      {social.handle}
                    </span>
                    <span className="text-label-secondary">↗</span>
                  </InsetList.ItemTrailing>
                </InsetList.ItemContent>
              </Link>
            </InsetList.Item>
          ))}
        </section>
      </InsetList.Section>
    </InsetList.Root>
  )
}
