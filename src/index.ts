#!/usr/bin/env node

import { Command } from './command'
import { Matcher } from './matcher'
import { Output } from './output'

const command = new Command
const output = new Output
const matcher = new Matcher(command, output)

output.header(command.extensions(), command.folders(), command.threshold(), command.print())

const comparisons = matcher.compareProjects()

output.results(comparisons)