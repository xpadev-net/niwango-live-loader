import babel from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';

const banner = `// ==UserScript==
// @name         niwango.js live loader
// @namespace    https://xpadev.net/
// @version      0.0.1
// @description  ニコニコ動画上でニワン語を実行するための試験的スクリプト
// @author       xpadev
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// ==/UserScript==
/*!
  niwango.js live loader
  (c) 2023 xpadev-net https://xpadev.net
  Released under the MIT License.
  */
/**
 * # 【重要】利用される方へ
 * 処理に使用しているniwango.jsはまだ開発途中であり、予期しない不具合によって異常な負荷がかかったり、突然動作しなくなったりする可能性があります
 * 使用する際は自己責任でお願いします
 *
 * # 使い方
 * 1. このスクリプトをTampermonkeyなどのユーザースクリプトマネージャーに登録する
 * 2. ニコニコ動画の動画再生ページを開く
 * 3. シークバーを動画の開始地点まで移動する
 * 4. 動画再生画面の右側の「コメントリスト」タブを開く
 * 5. 「コメントリスト」タブの下にある「ﾆﾜ」ボタンを押す
 *
 * # 更新について
 * GitHub上に公開されている最新のコードを自動的に読み込むため、基本的に更新は必要ありません
 */
`

const plugins = [
	typescript(),
	json(),
	image(),
	nodeResolve({
		extensions: [".js"],
		browser:true
	}),
	replace({
		preventAssignment: true,
		'process.env.NODE_ENV': JSON.stringify('production'),
	}),
	babel({
		babelHelpers: 'bundled',
		presets: [],
	}),
	commonjs(),
];

export default [
	{
		input: 'src/main.ts',
		output: {
			file: "dist/bundle.js",
			format: "umd",
			name: "niwango_live_loader",
			banner,
		},
		plugins: plugins,
	}
	]