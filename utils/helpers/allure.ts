import * as allure from 'allure-js-commons'

type LabelOptions = {
  epic?: string
  feature?: string
  story?: string
  severity?: 'critical' | 'normal' | 'minor' | 'trivial' | 'blocker'
  tags?: string[]
}

export function setLabels({ epic, feature, story, severity, tags }: LabelOptions) {
  if (epic) allure.epic(epic)
  if (feature) allure.feature(feature)
  if (story) allure.story(story)
  if (severity) allure.severity(severity)

  tags?.forEach((tag) => allure.tag(tag))
}
