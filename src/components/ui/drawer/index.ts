// TODO: Settle on a single drawer component
/** biome-ignore-all lint/style/noExportedImports: Will fix it later */
import { Drawer as ActionDrawer } from "./action"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandle,
  DrawerHeader,
  DrawerMaterial,
  DrawerNested,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer"
import { Drawer as DrawerV2 } from "./drawer-v2"
import { Drawer as DrawerV3 } from "./drawer-v3"

export {
  Drawer,
  DrawerNested,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerMaterial,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerTitle,
  DrawerDescription,
  DrawerHandle,
}
export { DrawerV2, DrawerV3, ActionDrawer }
