export default function mergeClass (...classes) {
  return classes.filter(v => v).join(' ')
}