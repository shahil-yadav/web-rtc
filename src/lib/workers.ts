import { fetchRandomAvatar } from '~/components/root/utils/storage'
import { close } from '~/components/screens/home/utils/terminate'
import { setupFirebase } from './firebase'

setupFirebase()

export { fetchRandomAvatar, close as terminate }
