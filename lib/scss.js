import CleanCSS from 'clean-css'
import fs from 'fs-extra'
import globImporter from 'node-sass-glob-importer'
import notifier from 'node-notifier'
import path from 'path'
import sass from 'node-sass'


const cleanCSS = new CleanCSS({level: 2, returnPromise: true, sourceMap: true})

export const scssRender = function(themeFile, cssTarget, options) {
    const cssDir = path.join(path.dirname(themeFile), '..', 'css')

    return new Promise((resolve, reject) => {
        sass.render({
            file: themeFile,
            importer: globImporter(),
            includePaths: options.includePaths,
            sourceMap: !options.optimize,
            sourceMapContents: true,
            sourceMapEmbed: false,
        }, async function(err, sassObj) {
            if (err) {
                notifier.notify({
                    title: 'SCSS Error',
                    message: err.formatted
                })
                reject(err.formatted)
            }
            let cssRules
            const promises = []

            if (options.optimize) {
                cssRules = (await cleanCSS.minify(sassObj.css)).styles

            } else {
                cssRules = sassObj.css
                if (options.write) promises.push(fs.writeFile(path.join(cssDir, `${cssTarget}.map`), sassObj.map))
            }

            if (options.write) promises.push(fs.writeFile(path.join(cssDir, cssTarget), cssRules))

            await Promise.all(promises)
            resolve({size: cssRules.length, rules: cssRules})
        })
    })
}


export default {
    scssRender
}