
import Translations from './Translations.json'

export default function Translate(lang) {
    const translation = Translations[lang]

    const trans = (value) => {
        return value && translation[value] ? translation[value] : value
    }

    return { trans }
}